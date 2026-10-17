import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { PRODUCTS, DEFAULT_CATEGORIES } from '../data/products';
import { AdminProduct, AdminOrder, ProductVariantCombination, ProductVariantOption } from '../types/admin';

const STORAGE_DIR = path.resolve(process.cwd(), 'src/server/storage');
const STORAGE_FILE = path.join(STORAGE_DIR, 'data-store.json');

// Ensure directory exists
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export async function runSeed(force: boolean = false) {
  console.log('--- Starting Arie Luxury Store Database Seed ---');

  let existingData: any = { admins: [], products: [], orders: [], auditLogs: [], siteTraffic: [] };
  if (fs.existsSync(STORAGE_FILE) && !force) {
    try {
      existingData = JSON.parse(fs.readFileSync(STORAGE_FILE, 'utf-8'));
    } catch (e) {
      existingData = { admins: [], products: [], orders: [], auditLogs: [], siteTraffic: [] };
    }
  }

  // 1. Seed Admin Account: declareola / arieb26a-a13fde053ca9?
  const adminUsername = process.env.ADMIN_INITIAL_USERNAME || 'declareola';
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'arieb26a-a13fde053ca9?';

  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

  const adminAccount = {
    id: 'admin_declareola_01',
    username: adminUsername,
    passwordHash,
    role: 'superadmin' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  };

  // Upsert admin
  const adminIndex = existingData.admins.findIndex((a: any) => a.username.toLowerCase() === adminUsername.toLowerCase());
  if (adminIndex >= 0) {
    existingData.admins[adminIndex] = adminAccount;
  } else {
    existingData.admins.push(adminAccount);
  }
  console.log(`✓ Admin user "${adminUsername}" seeded successfully with bcrypt(12) hash.`);

  // 2. Seed All 22 Products with Variants, Kobo Prices, and Discount Windows
  const now = new Date();
  const nextMonth = new Date();
  nextMonth.setDate(now.getDate() + 30);
  const lastMonth = new Date();
  lastMonth.setDate(now.getDate() - 30);

  const seededProducts: AdminProduct[] = PRODUCTS.map((p, index) => {
    const slug = generateSlug(p.name);
    const basePriceKobo = p.price * 100; // Store as integer kobo

    // Generate variants based on category or preserve existing
    let variantTypes: ProductVariantOption[] = p.variants?.types || [];
    let combinations: ProductVariantCombination[] = p.variants?.combinations || [];

    if (variantTypes.length === 0) {
      if (p.category === 'watches') {
      variantTypes = [
        { type: 'Dial Accent', values: ['Obsidian Black', 'Champagne Gold'] },
        { type: 'Band Fit', values: ['Standard (40-42mm)', 'Extended (43-45mm)'] }
      ];
      combinations = [
        {
          id: `${p.id}-v1`,
          sku: `${p.sku}-BLK-STD`,
          name: 'Obsidian Black / Standard',
          options: { 'Dial Accent': 'Obsidian Black', 'Band Fit': 'Standard (40-42mm)' },
          priceKobo: basePriceKobo,
          stockCount: Math.max(3, Math.floor(p.stockCount / 2)),
          image: p.images[0]
        },
        {
          id: `${p.id}-v2`,
          sku: `${p.sku}-GLD-EXT`,
          name: 'Champagne Gold / Extended',
          options: { 'Dial Accent': 'Champagne Gold', 'Band Fit': 'Extended (43-45mm)' },
          priceKobo: basePriceKobo + 200000, // +₦2,000 for extended links
          stockCount: Math.max(2, Math.ceil(p.stockCount / 2)),
          image: p.images[1] || p.images[0]
        }
      ];
    } else if (p.category === 'jerseys') {
      variantTypes = [
        { type: 'Size', values: ['Medium (M)', 'Large (L)', 'Extra Large (XL)'] }
      ];
      combinations = ['M', 'L', 'XL'].map((size, sIdx) => ({
        id: `${p.id}-v${sIdx + 1}`,
        sku: `${p.sku}-${size}`,
        name: `Size ${size}`,
        options: { Size: size },
        priceKobo: basePriceKobo,
        stockCount: Math.floor(p.stockCount / 3) + 2,
        image: p.images[0]
      }));
    } else if (p.category === 'jewelry') {
      variantTypes = [
        { type: 'Finish', values: ['18K Yellow Gold', 'White Gold Rhodium'] }
      ];
      combinations = [
        {
          id: `${p.id}-v1`,
          sku: `${p.sku}-YGD`,
          name: '18K Yellow Gold',
          options: { Finish: '18K Yellow Gold' },
          priceKobo: basePriceKobo,
          stockCount: Math.max(4, p.stockCount - 3),
          image: p.images[0]
        },
        {
          id: `${p.id}-v2`,
          sku: `${p.sku}-WGD`,
          name: 'White Gold Rhodium',
          options: { Finish: 'White Gold Rhodium' },
          priceKobo: basePriceKobo,
          stockCount: Math.max(3, 4),
          image: p.images[1] || p.images[0]
        }
      ];
    } else {
      // Accessories
      variantTypes = [
        { type: 'Wrist Circumference', values: ['Standard (18-20cm)', 'Large (21-23cm)'] }
      ];
      combinations = [
        {
          id: `${p.id}-v1`,
          sku: `${p.sku}-STD`,
          name: 'Standard (18-20cm)',
          options: { 'Wrist Circumference': 'Standard (18-20cm)' },
          priceKobo: basePriceKobo,
          stockCount: p.stockCount,
          image: p.images[0]
        }
      ];
    }
  }

    // Configure timed discounts if originalPrice existed or for select highlights
    let discount = undefined;
    if (p.originalPrice && p.originalPrice > p.price) {
      const discountKobo = (p.originalPrice - p.price) * 100;
      discount = {
        type: 'fixed' as const,
        value: discountKobo,
        startDate: lastMonth.toISOString(),
        endDate: nextMonth.toISOString(),
        isActive: true
      };
    } else if (index % 4 === 0) {
      discount = {
        type: 'percentage' as const,
        value: 10, // 10% promo
        startDate: lastMonth.toISOString(),
        endDate: nextMonth.toISOString(),
        isActive: true
      };
    }

    const tags = [
      p.category,
      p.isFeatured ? 'featured' : '',
      p.isBestseller ? 'bestseller' : '',
      p.isNew ? 'new-arrival' : '',
      'authentic',
      'luxury'
    ].filter(Boolean);

    return {
      id: p.id,
      name: p.name,
      slug,
      subtitle: p.subtitle,
      description: p.description,
      craftsmanship: p.craftsmanship,
      materials: p.materials,
      dimensions: p.dimensions,
      category: p.category,
      tags,
      images: p.images,
      variants: {
        types: variantTypes,
        combinations
      },
      basePriceKobo,
      discount,
      inStock: p.inStock,
      stockCount: p.stockCount,
      lowStockThreshold: 5,
      status: 'published' as const,
      isFeatured: !!p.isFeatured,
      isBestseller: !!p.isBestseller,
      isNew: !!p.isNew,
      sku: p.sku,
      rating: p.rating,
      reviewsCount: p.reviewsCount,
      specs: p.specs,
      createdAt: new Date(Date.now() - (30 - index) * 86400000).toISOString(),
      updatedAt: new Date().toISOString()
    };
  });

  existingData.products = seededProducts;
  console.log(`✓ Seeded all ${seededProducts.length} authentic products in admin database.`);

  // 3. Seed Realistic Orders for Analytics Dashboard
  if (!existingData.orders || existingData.orders.length === 0 || force) {
    const seededOrders: AdminOrder[] = [
      {
        id: 'ord_arie_1001',
        orderNumber: 'ARIE-ORD-2026-0891',
        customerName: 'Chinedu Okeke',
        customerEmail: 'chinedu.okeke@gmail.com',
        customerPhone: '+234 803 459 1120',
        deliveryAddress: 'Plot 14 Admiralty Way, Lekki Phase 1',
        deliveryState: 'Lagos',
        paymentMethod: 'bank_transfer',
        status: 'delivered',
        items: [
          {
            productId: 'arie-watch-gold-01',
            productName: 'Royal Chronos Gold Timepiece',
            variantSku: 'ARIE-WTC-001-BLK-STD',
            variantName: 'Obsidian Black / Standard',
            unitPriceKobo: 4850000,
            quantity: 1,
            totalKobo: 4850000,
            image: '/images/products/prod-watch-gold.jpg'
          },
          {
            productId: 'arie-bracelet-cuban-07',
            productName: 'Miami Cuban Link Gold Bracelet',
            unitPriceKobo: 2100000,
            quantity: 1,
            totalKobo: 2100000,
            image: '/images/products/prod-bracelet-cuban.jpg'
          }
        ],
        subtotalKobo: 6950000,
        discountKobo: 0,
        deliveryFeeKobo: 250000,
        totalKobo: 7200000,
        notes: 'Requested gift wrapping and authenticity certificate card.',
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
      },
      {
        id: 'ord_arie_1002',
        orderNumber: 'ARIE-ORD-2026-0892',
        customerName: 'Amina Bello',
        customerEmail: 'amina.bello88@yahoo.com',
        customerPhone: '+234 812 770 3341',
        deliveryAddress: 'Maitama District, Near Ministers Hill',
        deliveryState: 'Abuja',
        paymentMethod: 'paystack',
        status: 'shipped',
        items: [
          {
            productId: 'arie-pendant-gold-04',
            productName: 'Arie Signature Gold Coin Medallion',
            variantSku: 'ARIE-JWL-001-YGD',
            variantName: '18K Yellow Gold',
            unitPriceKobo: 2250000,
            quantity: 2,
            totalKobo: 4500000,
            image: '/images/products/prod-pendant-gold.jpg'
          }
        ],
        subtotalKobo: 4500000,
        discountKobo: 450000,
        deliveryFeeKobo: 250000,
        totalKobo: 4300000,
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'ord_arie_1003',
        orderNumber: 'ARIE-ORD-2026-0893',
        customerName: 'Oluwaseun Adeyemi',
        customerEmail: 'seun.adeyemi@outlook.com',
        customerPhone: '+234 705 918 2033',
        deliveryAddress: 'Opposite State Secretariat, Ganaja Road',
        deliveryState: 'Kogi',
        paymentMethod: 'cash_on_delivery',
        status: 'processing',
        items: [
          {
            productId: 'arie-watch-chronograph-02',
            productName: 'Executive Chronograph Black Dial Watch',
            variantSku: 'ARIE-WTC-002-BLK-STD',
            variantName: 'Obsidian Black / Standard',
            unitPriceKobo: 5200000,
            quantity: 1,
            totalKobo: 5200000,
            image: '/images/products/prod-watch-chronograph.jpg'
          }
        ],
        subtotalKobo: 5200000,
        discountKobo: 520000,
        deliveryFeeKobo: 0,
        totalKobo: 4680000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'ord_arie_1004',
        orderNumber: 'ARIE-ORD-2026-0894',
        customerName: 'Dr. Ifeanyi Nnamdi',
        customerEmail: 'ifeanyi.nnamdi@unilag.edu.ng',
        customerPhone: '+234 802 331 9988',
        deliveryAddress: 'GRA Phase 2, Port Harcourt',
        deliveryState: 'Rivers',
        paymentMethod: 'bank_transfer',
        status: 'pending',
        items: [
          {
            productId: 'arie-tennis-bracelet-15',
            productName: 'Pavé Tennis Bracelet in Brilliant Gold',
            unitPriceKobo: 2950000,
            quantity: 1,
            totalKobo: 2950000,
            image: '/images/products/prod-tennis-bracelet.jpg'
          },
          {
            productId: 'arie-jersey-club-17',
            productName: 'Arsenal Gold Crest Away Edition Jersey',
            variantSku: 'ARIE-JSY-001-L',
            variantName: 'Size L',
            unitPriceKobo: 1950000,
            quantity: 1,
            totalKobo: 1950000,
            image: '/images/products/prod-jersey-club.jpg'
          }
        ],
        subtotalKobo: 4900000,
        discountKobo: 0,
        deliveryFeeKobo: 450000,
        totalKobo: 5350000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    existingData.orders = seededOrders;
    console.log(`✓ Seeded ${seededOrders.length} initial verified customer orders.`);
  }

  // 4. Seed Product Categories
  if (!existingData.categories || existingData.categories.length === 0 || force) {
    existingData.categories = DEFAULT_CATEGORIES;
    console.log(`✓ Seeded ${DEFAULT_CATEGORIES.length} product categories in admin database.`);
  }

  // 5. Seed Initial Audit Logs
  if (!existingData.auditLogs || existingData.auditLogs.length === 0 || force) {
    existingData.auditLogs = [
      {
        id: 'log_seed_01',
        timestamp: new Date().toISOString(),
        adminUsername: adminUsername,
        action: 'SYSTEM_INITIALIZATION',
        details: 'Admin store database successfully seeded with all 22 products and initial admin credentials.',
        ipAddress: '127.0.0.1'
      }
    ];
  }

  // Write to storage file
  fs.writeFileSync(STORAGE_FILE, JSON.stringify(existingData, null, 2), 'utf-8');
  console.log(`✓ Data store saved to ${STORAGE_FILE}`);
  console.log('--- Database Seeding Completed Successfully ---');
}

// Auto-run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSeed().catch(console.error);
}
