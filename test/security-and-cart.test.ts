import assert from 'assert';
import { requireAdminAuth } from '../src/server/auth';
import { checkLoginLockout, recordFailedLogin, resetFailedLogins, getProductById } from '../src/server/db';
import { verifyCartAndPrices, calculateAuthoritativePrice, isDiscountActive } from '../src/server/price-calculator';
import { runSeed } from '../src/server/seed';

async function runTestSuite() {
  console.log('====================================================');
  console.log(' RUNNING SECURITY & SERVER-SIDE PRICE TEST SUITE');
  console.log('====================================================\n');

  // Ensure DB seed is loaded
  await runSeed();

  let passedTests = 0;
  let totalTests = 0;

  function test(name: string, fn: () => void | Promise<void>) {
    totalTests++;
    return Promise.resolve()
      .then(fn)
      .then(() => {
        console.log(`  ✓ PASS: ${name}`);
        passedTests++;
      })
      .catch(err => {
        console.error(`  ✗ FAIL: ${name}`);
        console.error(`    ${err.stack || err.message}`);
      });
  }

  // --- TEST 1: Unauthorized access to /api/admin/* returns 401 ---
  await test('Unauthorized access to /api/admin/* without session returns 401', () => {
    let statusCode = 0;
    let jsonResponse: any = null;

    const req: any = {
      path: '/api/admin/products',
      cookies: {},
      headers: {}
    };

    const res: any = {
      status(code: number) {
        statusCode = code;
        return this;
      },
      json(data: any) {
        jsonResponse = data;
        return this;
      },
      redirect: () => {}
    };

    const next = () => {
      throw new Error('next() should not be called for unauthenticated request');
    };

    requireAdminAuth(req, res, next);

    assert.strictEqual(statusCode, 401, `Expected status 401, got ${statusCode}`);
    assert.ok(jsonResponse && jsonResponse.error, 'Expected JSON error response');
    assert.match(jsonResponse.error, /Unauthorized/i, 'Error message should state Unauthorized');
  });

  // --- TEST 2: Login lockout and brute-force protection ---
  await test('Brute-force protection: 5 failed login attempts trigger security lockout (429)', () => {
    const testKey = '192.168.1.100_attacker_test';
    resetFailedLogins(testKey);

    // Initial check: not locked
    const initialCheck = checkLoginLockout(testKey);
    assert.strictEqual(initialCheck.isLocked, false);

    // 4 failed attempts should not lock yet
    for (let i = 1; i <= 4; i++) {
      const res = recordFailedLogin(testKey);
      assert.strictEqual(res.isLocked, false, `Attempt ${i} should not lock yet`);
      assert.strictEqual(res.remainingAttempts, 5 - i);
    }

    // 5th failed attempt triggers lockout
    const fifthResult = recordFailedLogin(testKey);
    assert.strictEqual(fifthResult.isLocked, true, '5th attempt must trigger lockout');
    assert.strictEqual(fifthResult.remainingAttempts, 0);
    assert.ok(fifthResult.remainingSeconds > 0, 'Lockout must have positive remaining duration');

    // Immediate check confirms locked state
    const lockedCheck = checkLoginLockout(testKey);
    assert.strictEqual(lockedCheck.isLocked, true, 'checkLoginLockout must return true');

    // Clean up
    resetFailedLogins(testKey);
    const clearedCheck = checkLoginLockout(testKey);
    assert.strictEqual(clearedCheck.isLocked, false, 'Lockout must clear after reset');
  });

  // --- TEST 3: Server-side price recalculation completely ignores client-sent prices ---
  await test('Server-side price recalculation completely ignores client-tampered prices', async () => {
    const testWatch = await getProductById('arie-drive-01');
    assert.ok(testWatch, 'Product arie-drive-01 must exist in DB');

    const expectedAuthoritativeBaseKobo = testWatch.basePriceKobo; // 1500000 kobo (₦15,000)
    assert.strictEqual(expectedAuthoritativeBaseKobo, 1500000);

    // Malicious client sends price = ₦100 (10000 kobo)
    const clientTamperedItems = [
      {
        productId: 'arie-drive-01',
        quantity: 2,
        clientPrice: 100 // Attempting to buy ₦15,000 watch for ₦100!
      }
    ];

    const result = await verifyCartAndPrices(clientTamperedItems, 'Lagos');

    assert.ok(result.priceTamperedDetected, 'Server must detect price tampering attempt');
    assert.strictEqual(result.items.length, 1);

    const verifiedItem = result.items[0];
    // Authoritative unit price must be from DB, NEVER from client
    assert.strictEqual(
      verifiedItem.unitBasePriceKobo,
      expectedAuthoritativeBaseKobo,
      'Unit base price must match database authority, NOT client price'
    );

    // Total must be 2 * authoritative final price
    assert.strictEqual(
      verifiedItem.totalKobo,
      verifiedItem.unitFinalPriceKobo * 2,
      'Item total must equal unitFinalPrice * 2'
    );

    // Verify subtotal matches server calculation
    assert.strictEqual(
      result.subtotalKobo,
      verifiedItem.unitBasePriceKobo * 2,
      'Subtotal must strictly reflect server database price'
    );
  });

  // --- TEST 4: Timed discount promotion validity calculation in UTC ---
  await test('Timed promotions evaluate discount window correctly', () => {
    const now = new Date();
    const future = new Date(Date.now() + 86400000).toISOString();
    const past = new Date(Date.now() - 86400000).toISOString();

    // Active discount: started yesterday, ends tomorrow
    const activeDiscount = {
      type: 'percentage' as const,
      value: 15,
      startDate: past,
      endDate: future,
      isActive: true
    };
    assert.strictEqual(isDiscountActive(activeDiscount), true);

    // Expired discount: started 2 days ago, ended yesterday
    const expiredDiscount = {
      type: 'percentage' as const,
      value: 20,
      startDate: new Date(Date.now() - 2 * 86400000).toISOString(),
      endDate: past,
      isActive: true
    };
    assert.strictEqual(isDiscountActive(expiredDiscount), false);

    // Inactive toggle discount
    const inactiveDiscount = {
      ...activeDiscount,
      isActive: false
    };
    assert.strictEqual(isDiscountActive(inactiveDiscount), false);
  });

  console.log('\n====================================================');
  console.log(` TEST SUMMARY: ${passedTests}/${totalTests} tests passed.`);
  console.log('====================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
