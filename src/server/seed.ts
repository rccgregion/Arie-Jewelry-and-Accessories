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

  // 3. Customer Orders - Clean production state for real customers
  if (!existingData.orders || force) {
    existingData.orders = [];
    console.log(`✓ Initialized clean order registry ready for real customer purchases.`);
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
