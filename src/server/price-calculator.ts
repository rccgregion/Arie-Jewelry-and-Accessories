import { getAllProducts, getProductById } from './db';
import { AdminProduct } from '../types/admin';

export interface ClientCartItemInput {
  productId: string;
  variantSku?: string;
  quantity: number;
  clientPrice?: number; // Intentionally ignored or flagged if different from authoritative server price
}

export interface VerifiedCartItem {
  productId: string;
  name: string;
  variantSku?: string;
  variantName?: string;
  image: string;
  quantity: number;
  unitBasePriceKobo: number;
  unitDiscountKobo: number;
  unitFinalPriceKobo: number;
  totalKobo: number;
  stockAvailable: number;
  inStock: boolean;
  activeDiscountDescription?: string;
}

export interface CartVerificationResult {
  isValid: boolean;
  items: VerifiedCartItem[];
  subtotalKobo: number;
  totalDiscountKobo: number;
  deliveryFeeKobo: number;
  totalKobo: number;
  // Formatted representations in NGN (₦)
  subtotalNgn: number;
  totalDiscountNgn: number;
  deliveryFeeNgn: number;
  totalNgn: number;
  priceTamperedDetected: boolean;
  warnings: string[];
}

/**
 * Check if a timed promotion / discount is currently valid in UTC
 */
export function isDiscountActive(discount?: AdminProduct['discount']): boolean {
  if (!discount || discount.value <= 0) return false;
  if (discount.isActive === false) return false;

  const nowUtc = Date.now();

  if (discount.startDate) {
    const start = new Date(discount.startDate).getTime();
    if (nowUtc < start) return false; // not started yet
  }

  if (discount.endDate) {
    const end = new Date(discount.endDate).getTime();
    if (nowUtc > end) return false; // expired
  }

  return true;
}

/**
 * Calculate authoritative server-side price for a product / variant
 */
export function calculateAuthoritativePrice(
  product: AdminProduct,
  variantSku?: string
): {
  unitBasePriceKobo: number;
  unitDiscountKobo: number;
  unitFinalPriceKobo: number;
  discountDescription?: string;
} {
  let basePriceKobo = product.basePriceKobo;

  // Check if variant overrides price
  if (variantSku && product.variants?.combinations) {
    const variant = product.variants.combinations.find(v => v.sku === variantSku);
    if (variant && typeof variant.priceKobo === 'number' && variant.priceKobo > 0) {
      basePriceKobo = variant.priceKobo;
    }
  }

  let unitDiscountKobo = 0;
  let discountDescription: string | undefined;

  if (isDiscountActive(product.discount)) {
    const discount = product.discount!;
    if (discount.type === 'percentage') {
      const pct = Math.min(100, Math.max(0, discount.value));
      unitDiscountKobo = Math.round((basePriceKobo * pct) / 100);
      discountDescription = `${pct}% Timed Promotion`;
    } else if (discount.type === 'fixed') {
      unitDiscountKobo = Math.min(basePriceKobo, discount.value);
      discountDescription = `₦${(discount.value / 100).toLocaleString()} Off Promo`;
    }
  }

  const unitFinalPriceKobo = Math.max(0, basePriceKobo - unitDiscountKobo);

  return {
    unitBasePriceKobo: basePriceKobo,
    unitDiscountKobo,
    unitFinalPriceKobo,
    discountDescription
  };
}

/**
 * Server-Side Cart & Price Verification
 * IGNORES all client-submitted prices and recalculates strictly from DB.
 */
export async function verifyCartAndPrices(
  cartItems: ClientCartItemInput[],
  deliveryState: string = 'Lagos'
): Promise<CartVerificationResult> {
  const verifiedItems: VerifiedCartItem[] = [];
  const warnings: string[] = [];
  let priceTamperedDetected = false;

  for (const item of cartItems) {
    const product = await getProductById(item.productId);

    if (!product || product.status !== 'published') {
      warnings.push(`Item with ID "${item.productId}" is currently unavailable or has been archived.`);
      continue;
    }

    const qty = Math.max(1, Math.min(99, Math.floor(Number(item.quantity) || 1)));

    // Verify variant and stock
    let variantSku = item.variantSku;
    let variantName = '';
    let stockAvailable = product.stockCount;
    let selectedImage = product.images[0] || '/images/products/prod-watch-gold.jpg';

    if (variantSku && product.variants?.combinations) {
      const variant = product.variants.combinations.find(v => v.sku === variantSku);
      if (variant) {
        variantName = variant.name;
        stockAvailable = variant.stockCount;
        if (variant.image) selectedImage = variant.image;
      }
    }

    const inStock = product.inStock && stockAvailable > 0;
    if (!inStock) {
      warnings.push(`"${product.name}" is currently out of stock.`);
    } else if (qty > stockAvailable) {
      warnings.push(`Requested quantity for "${product.name}" exceeds available stock (${stockAvailable}).`);
    }

    const priceCalc = calculateAuthoritativePrice(product, variantSku);

    // Check if client sent an altered price
    if (item.clientPrice !== undefined && item.clientPrice !== null) {
      // Client price in kobo or NGN
      const clientKobo = item.clientPrice > 100000 ? item.clientPrice : item.clientPrice * 100;
      if (Math.abs(clientKobo - priceCalc.unitFinalPriceKobo) > 50) {
        priceTamperedDetected = true;
      }
    }

    const totalKobo = priceCalc.unitFinalPriceKobo * qty;

    verifiedItems.push({
      productId: product.id,
      name: product.name,
      variantSku,
      variantName: variantName || undefined,
      image: selectedImage,
      quantity: qty,
      unitBasePriceKobo: priceCalc.unitBasePriceKobo,
      unitDiscountKobo: priceCalc.unitDiscountKobo,
      unitFinalPriceKobo: priceCalc.unitFinalPriceKobo,
      totalKobo,
      stockAvailable,
      inStock,
      activeDiscountDescription: priceCalc.discountDescription
    });
  }

  const subtotalKobo = verifiedItems.reduce((sum, item) => sum + (item.unitBasePriceKobo * item.quantity), 0);
  const totalDiscountKobo = verifiedItems.reduce((sum, item) => sum + (item.unitDiscountKobo * item.quantity), 0);

  // Delivery fee logic: Flat ₦2,500 for Lagos/Kogi, ₦4,500 nationwide, free for orders above ₦100,000
  let deliveryFeeKobo = 450000;
  if (['lagos', 'kogi', 'abuja'].includes(deliveryState.toLowerCase().trim())) {
    deliveryFeeKobo = 250000;
  }
  if ((subtotalKobo - totalDiscountKobo) >= 10000000) { // Free shipping over ₦100k
    deliveryFeeKobo = 0;
  }

  const totalKobo = Math.max(0, subtotalKobo - totalDiscountKobo + deliveryFeeKobo);

  return {
    isValid: verifiedItems.length > 0 && verifiedItems.every(i => i.inStock),
    items: verifiedItems,
    subtotalKobo,
    totalDiscountKobo,
    deliveryFeeKobo,
    totalKobo,
    subtotalNgn: Math.round(subtotalKobo / 100),
    totalDiscountNgn: Math.round(totalDiscountKobo / 100),
    deliveryFeeNgn: Math.round(deliveryFeeKobo / 100),
    totalNgn: Math.round(totalKobo / 100),
    priceTamperedDetected,
    warnings
  };
}
