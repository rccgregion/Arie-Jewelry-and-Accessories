import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import { 
  handleLogin, 
  handleChangePassword, 
  requireAdminAuth, 
  clearSessionCookie,
  signSessionToken,
  setSessionCookie
} from './src/server/auth';
import { 
  getAllProducts, 
  getPublishedProducts, 
  getProductById, 
  saveProduct, 
  deleteProduct, 
  getAllOrders, 
  getOrderById, 
  saveOrder, 
  updateOrderStatus, 
  getAnalyticsSummary, 
  getAuditLogs, 
  addAuditLog,
  getAdminByUsername,
  checkSupabaseStatus,
  syncLocalDataToSupabase,
  resetAllFailedLogins,
  getAllCategories,
  getCategoryById,
  saveCategory,
  deleteCategory
} from './src/server/db';
import { verifyCartAndPrices } from './src/server/price-calculator';
import { uploadMiddleware, handleImageUpload } from './src/server/upload';
import { runSeed } from './src/server/seed';
import { AdminProduct } from './src/types/admin';

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProduction = process.env.NODE_ENV === 'production';

// Ensure database is initialized
runSeed().catch(err => console.error('Error verifying database seed:', err));

// 1. Core Parsers
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());

// 2. Security Headers & CSP
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  if (isProduction) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  // Inject noindex on admin pages or APIs
  if (req.path.startsWith('/admin') || req.path.startsWith('/api/admin')) {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  }

  next();
});

// 3. Static files for public images & uploads
const publicDir = path.resolve(process.cwd(), 'public');
app.use(express.static(publicDir));
const uploadsDir = path.resolve(publicDir, 'images/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/images/uploads', express.static(uploadsDir));

// --- API ROUTES ---

// Public Products API (Read-only, published products only)
app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const products = await getPublishedProducts();
    // Return sanitized public catalog
    const publicProducts = products.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      subtitle: p.subtitle,
      description: p.description,
      craftsmanship: p.craftsmanship,
      materials: p.materials,
      dimensions: p.dimensions,
      category: p.category,
      tags: p.tags,
      images: p.images,
      price: Math.round(p.basePriceKobo / 100), // NGN representation
      basePriceKobo: p.basePriceKobo,
      originalPrice: p.discount?.isActive && p.discount.value > 0 ? Math.round((p.basePriceKobo + (p.discount.type === 'fixed' ? p.discount.value : (p.basePriceKobo * p.discount.value) / 100)) / 100) : undefined,
      inStock: p.inStock && p.stockCount > 0,
      stockCount: p.stockCount,
      isFeatured: p.isFeatured,
      isBestseller: p.isBestseller,
      isNew: p.isNew,
      rating: p.rating || 4.9,
      reviewsCount: p.reviewsCount || 12,
      sku: p.sku,
      specs: p.specs,
      variants: p.variants
    }));

    return res.json({ success: true, products: publicProducts });
  } catch (err: any) {
    console.error('Error fetching public products:', err);
    return res.status(500).json({ error: 'Failed to retrieve product catalog.' });
  }
});

// Public Categories API
app.get('/api/categories', async (req: Request, res: Response) => {
  try {
    const categories = await getAllCategories();
    return res.json({ success: true, categories });
  } catch (err: any) {
    console.error('Error fetching categories:', err);
    return res.status(500).json({ error: 'Failed to retrieve categories.' });
  }
});

// Server-side Cart & Price Verification Endpoint
app.post('/api/cart/verify', async (req: Request, res: Response) => {
  try {
    const { items, deliveryState } = req.body || {};
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Cart items array is required.' });
    }

    const verification = await verifyCartAndPrices(items, deliveryState || 'Lagos');
    return res.json({
      success: true,
      ...verification
    });
  } catch (err: any) {
    console.error('Error verifying cart:', err);
    return res.status(500).json({ error: 'Error calculating verified order pricing.' });
  }
});

// Checkout Endpoint (Creates order using verified server prices, decrements stock)
app.post('/api/checkout', async (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';

  try {
    const { 
      items, 
      customerName, 
      customerEmail, 
      customerPhone, 
      deliveryAddress, 
      deliveryState, 
      paymentMethod,
      notes 
    } = req.body || {};

    if (!items || !items.length || !customerName || !customerPhone || !deliveryAddress) {
      return res.status(400).json({ error: 'Missing required checkout information.' });
    }

    // Authoritative calculation ignoring client prices
    const verifiedCart = await verifyCartAndPrices(items, deliveryState || 'Lagos');

    if (!verifiedCart.isValid) {
      return res.status(400).json({ 
        error: 'One or more items in your cart are currently out of stock or unavailable.',
        warnings: verifiedCart.warnings 
      });
    }

    // Create Order
    const orderNumber = `ARIE-ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      orderNumber,
      customerName: customerName.trim(),
      customerEmail: customerEmail?.trim() || `${customerPhone.replace(/[^0-9]/g, '')}@customer.ariejewelry.com`,
      customerPhone: customerPhone.trim(),
      deliveryAddress: deliveryAddress.trim(),
      deliveryState: deliveryState || 'Lagos',
      paymentMethod: paymentMethod || 'bank_transfer',
      status: 'pending' as const,
      items: verifiedCart.items.map(i => ({
        productId: i.productId,
        productName: i.name,
        variantSku: i.variantSku,
        variantName: i.variantName,
        unitPriceKobo: i.unitFinalPriceKobo,
        quantity: i.quantity,
        totalKobo: i.totalKobo,
        image: i.image
      })),
      subtotalKobo: verifiedCart.subtotalKobo,
      discountKobo: verifiedCart.totalDiscountKobo,
      deliveryFeeKobo: verifiedCart.deliveryFeeKobo,
      totalKobo: verifiedCart.totalKobo,
      notes: notes?.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await saveOrder(newOrder);

    // Decrement stock for purchased items
    for (const item of verifiedCart.items) {
      const product = await getProductById(item.productId);
      if (product) {
        product.stockCount = Math.max(0, product.stockCount - item.quantity);
        if (item.variantSku && product.variants?.combinations) {
          const variant = product.variants.combinations.find(v => v.sku === item.variantSku);
          if (variant) {
            variant.stockCount = Math.max(0, variant.stockCount - item.quantity);
          }
        }
        await saveProduct(product);
      }
    }

    // Log action
    await addAuditLog({
      adminUsername: 'system/customer',
      action: 'ORDER_PLACED',
      details: `New order ${orderNumber} placed for ₦${verifiedCart.totalNgn.toLocaleString()} by ${customerName}.`,
      ipAddress: clientIp
    });

    return res.json({
      success: true,
      order: newOrder,
      message: 'Order placed successfully.'
    });
  } catch (err: any) {
    console.error('Error during checkout:', err);
    return res.status(500).json({ error: 'Server error processing order.' });
  }
});

// Admin Authentication Endpoints
app.post('/api/auth/login', handleLogin);

app.post('/api/auth/logout', (req: Request, res: Response) => {
  clearSessionCookie(res);
  return res.json({ success: true, message: 'Logged out successfully.' });
});

app.get('/api/auth/me', requireAdminAuth, (req: Request, res: Response) => {
  return res.json({
    success: true,
    user: req.admin
  });
});

app.post('/api/auth/change-password', requireAdminAuth, handleChangePassword);

// --- PROTECTED ADMIN API ENDPOINTS ---

// Admin Products CRUD
app.get('/api/admin/products', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const products = await getAllProducts();
    return res.json({ success: true, products });
  } catch (err: any) {
    console.error('Error getting admin products:', err);
    return res.status(500).json({ error: 'Failed to retrieve products.' });
  }
});

// Validation schema for Admin Product
const productZodSchema = z.object({
  name: z.string().min(2, 'Product name must have at least 2 characters'),
  slug: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().min(5, 'Description is required'),
  craftsmanship: z.string().optional(),
  materials: z.array(z.string()).optional(),
  dimensions: z.string().optional(),
  category: z.string().min(2, 'Category is required'),
  tags: z.array(z.string()).optional(),
  images: z.array(z.string()).min(1, 'At least one product image is required'),
  basePriceKobo: z.number().int().positive('Base price must be a positive integer in kobo'),
  discount: z.object({
    type: z.enum(['percentage', 'fixed']),
    value: z.number().min(0),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    isActive: z.boolean().optional()
  }).optional(),
  stockCount: z.number().int().min(0, 'Stock count must be 0 or greater'),
  lowStockThreshold: z.number().int().min(0).default(5),
  status: z.enum(['published', 'draft', 'archived']).default('published'),
  isFeatured: z.boolean().default(false),
  isBestseller: z.boolean().default(false),
  isNew: z.boolean().default(false),
  sku: z.string().min(2, 'SKU is required'),
  variants: z.any().optional(),
  specs: z.record(z.string(), z.string()).optional()
});

app.post('/api/admin/products', requireAdminAuth, async (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';

  try {
    const parsed = productZodSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`)
      });
    }

    const data = parsed.data;
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const id = `arie_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const newProduct: AdminProduct = {
      id,
      name: data.name,
      slug,
      subtitle: data.subtitle,
      description: data.description,
      craftsmanship: data.craftsmanship,
      materials: data.materials || [],
      dimensions: data.dimensions,
      category: data.category as any,
      tags: data.tags || [data.category],
      images: data.images,
      basePriceKobo: data.basePriceKobo,
      discount: data.discount,
      inStock: data.stockCount > 0,
      stockCount: data.stockCount,
      lowStockThreshold: data.lowStockThreshold,
      status: data.status,
      isFeatured: data.isFeatured,
      isBestseller: data.isBestseller,
      isNew: data.isNew,
      sku: data.sku,
      variants: data.variants,
      specs: data.specs,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await saveProduct(newProduct);

    await addAuditLog({
      adminUsername: req.admin?.username || 'admin',
      action: 'PRODUCT_CREATED',
      details: `Created product "${newProduct.name}" (SKU: ${newProduct.sku}) with base price ₦${(newProduct.basePriceKobo / 100).toLocaleString()}.`,
      ipAddress: clientIp
    });

    return res.status(201).json({ success: true, product: newProduct });
  } catch (err: any) {
    console.error('Error creating product:', err);
    return res.status(500).json({ error: 'Server error creating product.' });
  }
});

app.put('/api/admin/products/:id', requireAdminAuth, async (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
  const { id } = req.params;

  try {
    const existing = await getProductById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const parsed = productZodSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`)
      });
    }

    const updates = parsed.data;
    const updatedProduct: AdminProduct = {
      ...existing,
      ...updates,
      inStock: (updates.stockCount !== undefined ? updates.stockCount : existing.stockCount) > 0,
      updatedAt: new Date().toISOString()
    };

    await saveProduct(updatedProduct);

    await addAuditLog({
      adminUsername: req.admin?.username || 'admin',
      action: 'PRODUCT_UPDATED',
      details: `Updated product "${updatedProduct.name}" (ID: ${updatedProduct.id}).`,
      ipAddress: clientIp
    });

    return res.json({ success: true, product: updatedProduct });
  } catch (err: any) {
    console.error('Error updating product:', err);
    return res.status(500).json({ error: 'Server error updating product.' });
  }
});

app.delete('/api/admin/products/:id', requireAdminAuth, async (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
  const { id } = req.params;

  try {
    const existing = await getProductById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    await deleteProduct(id);

    await addAuditLog({
      adminUsername: req.admin?.username || 'admin',
      action: 'PRODUCT_DELETED',
      details: `Deleted product "${existing.name}" (SKU: ${existing.sku}).`,
      ipAddress: clientIp
    });

    return res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (err: any) {
    console.error('Error deleting product:', err);
    return res.status(500).json({ error: 'Server error deleting product.' });
  }
});

// Admin Categories CRUD
app.get('/api/admin/categories', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const categories = await getAllCategories();
    return res.json({ success: true, categories });
  } catch (err: any) {
    console.error('Error fetching admin categories:', err);
    return res.status(500).json({ error: 'Failed to retrieve categories.' });
  }
});

app.post('/api/admin/categories', requireAdminAuth, async (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
  try {
    const { name, slug, description, image, displayOrder } = req.body || {};
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Category name must have at least 2 characters.' });
    }

    const saved = await saveCategory({
      name: name.trim(),
      slug: slug?.trim() || undefined,
      description: description?.trim() || undefined,
      image: image?.trim() || undefined,
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : undefined
    });

    await addAuditLog({
      adminUsername: req.admin?.username || 'admin',
      action: 'CATEGORY_CREATED',
      details: `Created new category "${saved.name}" (Slug: ${saved.slug}).`,
      ipAddress: clientIp
    });

    return res.status(201).json({ success: true, category: saved });
  } catch (err: any) {
    console.error('Error creating category:', err);
    return res.status(500).json({ error: 'Server error creating category.' });
  }
});

app.put('/api/admin/categories/:id', requireAdminAuth, async (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
  const { id } = req.params;

  try {
    const { name, slug, description, image, displayOrder } = req.body || {};
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Category name must have at least 2 characters.' });
    }

    const existing = await getCategoryById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    const updated = await saveCategory({
      id,
      name: name.trim(),
      slug: slug?.trim() || undefined,
      description: description?.trim() || undefined,
      image: image?.trim() || undefined,
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : undefined
    });

    await addAuditLog({
      adminUsername: req.admin?.username || 'admin',
      action: 'CATEGORY_UPDATED',
      details: `Updated category "${updated.name}" (ID: ${id}).`,
      ipAddress: clientIp
    });

    return res.json({ success: true, category: updated });
  } catch (err: any) {
    console.error('Error updating category:', err);
    return res.status(500).json({ error: 'Server error updating category.' });
  }
});

app.delete('/api/admin/categories/:id', requireAdminAuth, async (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
  const { id } = req.params;

  try {
    const result = await deleteCategory(id);
    if (!result.success) {
      return res.status(400).json({ error: result.error || 'Failed to delete category.' });
    }

    await addAuditLog({
      adminUsername: req.admin?.username || 'admin',
      action: 'CATEGORY_DELETED',
      details: `Deleted product category with ID "${id}".`,
      ipAddress: clientIp
    });

    return res.json({ success: true, message: 'Category deleted successfully.' });
  } catch (err: any) {
    console.error('Error deleting category:', err);
    return res.status(500).json({ error: 'Server error deleting category.' });
  }
});

// Admin Orders
app.get('/api/admin/orders', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const orders = await getAllOrders();
    return res.json({ success: true, orders });
  } catch (err: any) {
    console.error('Error fetching admin orders:', err);
    return res.status(500).json({ error: 'Failed to retrieve orders.' });
  }
});

app.put('/api/admin/orders/:id/status', requireAdminAuth, async (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid order status.' });
  }

  try {
    const updated = await updateOrderStatus(id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    await addAuditLog({
      adminUsername: req.admin?.username || 'admin',
      action: 'ORDER_STATUS_CHANGED',
      details: `Updated order ${updated.orderNumber} status to "${status}".`,
      ipAddress: clientIp
    });

    return res.json({ success: true, order: updated });
  } catch (err: any) {
    console.error('Error updating order status:', err);
    return res.status(500).json({ error: 'Server error updating order status.' });
  }
});

// Admin Analytics Dashboard
app.get('/api/admin/analytics', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const range = (req.query.range as any) || '7d';
    const customStart = req.query.start as string | undefined;
    const customEnd = req.query.end as string | undefined;

    const summary = await getAnalyticsSummary(range, customStart, customEnd);
    return res.json({ success: true, analytics: summary });
  } catch (err: any) {
    console.error('Error fetching analytics:', err);
    return res.status(500).json({ error: 'Failed to compute store analytics.' });
  }
});

// Admin Audit Logs
app.get('/api/admin/audit-logs', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string || '50', 10);
    const logs = await getAuditLogs(limit);
    return res.json({ success: true, logs });
  } catch (err: any) {
    console.error('Error fetching audit logs:', err);
    return res.status(500).json({ error: 'Failed to retrieve audit logs.' });
  }
});

// Admin Image Upload
app.post('/api/admin/upload', requireAdminAuth, uploadMiddleware, handleImageUpload);

// Reset Lockout endpoint (allows administrator to clear lockout)
app.post('/api/auth/reset-lockout', (req: Request, res: Response) => {
  resetAllFailedLogins();
  return res.json({ success: true, message: 'Admin login lockout counters successfully reset.' });
});

// Supabase Status check (accessible to admin or for initial diagnostics)
app.get('/api/admin/supabase-status', async (req: Request, res: Response) => {
  try {
    const status = await checkSupabaseStatus();
    return res.json({ success: true, status });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error checking Supabase status' });
  }
});

// Supabase Data Sync (pushes all 22 products to Supabase when tables exist)
app.post('/api/admin/supabase-sync', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const syncResult = await syncLocalDataToSupabase();
    return res.json(syncResult);
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'Error syncing data to Supabase' });
  }
});

// Provide raw SQL schema endpoint
app.get('/api/supabase-schema.sql', (req: Request, res: Response) => {
  const schemaPath = path.resolve(process.cwd(), 'supabase-schema.sql');
  if (fs.existsSync(schemaPath)) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.sendFile(schemaPath);
  }
  return res.status(404).send('-- Schema file not found');
});

// 4. Vite Dev Server / Static Production Serving
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✓ Arie Luxury Store & Admin Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
