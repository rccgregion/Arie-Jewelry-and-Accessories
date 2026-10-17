import { Category, ProductCategory } from './index';

export type { ProductCategory };

export type ProductStatus = 'published' | 'draft' | 'archived';

export interface ProductVariantOption {
  type: string; // e.g. "Size", "Color", "Material"
  values: string[]; // e.g. ["40mm", "42mm"] or ["Gold", "Silver"]
}

export interface ProductVariantCombination {
  id: string;
  sku: string;
  name: string; // e.g. "Gold / 42mm"
  options: Record<string, string>; // { "Color": "Gold", "Size": "42mm" }
  priceKobo?: number; // Override price if different from basePriceKobo
  stockCount: number;
  image?: string;
}

export interface DiscountConfig {
  type: 'percentage' | 'fixed';
  value: number; // e.g. 15 for 15%, or 500000 kobo for ₦5,000 off
  startDate?: string; // ISO 8601 UTC
  endDate?: string;   // ISO 8601 UTC
  isActive?: boolean;
}

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  subtitle?: string;
  description: string;
  craftsmanship?: string;
  materials?: string[];
  dimensions?: string;
  category: Category;
  tags: string[];
  images: string[];
  variants?: {
    types: ProductVariantOption[];
    combinations: ProductVariantCombination[];
  };
  basePriceKobo: number; // integer kobo (e.g. ₦48,500 = 4850000 kobo)
  discount?: DiscountConfig;
  inStock: boolean;
  stockCount: number;
  lowStockThreshold: number;
  status: ProductStatus;
  isFeatured: boolean;
  isBestseller: boolean;
  isNew: boolean;
  sku: string;
  rating?: number;
  reviewsCount?: number;
  specs?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  variantSku?: string;
  variantName?: string;
  unitPriceKobo: number;
  quantity: number;
  totalKobo: number;
  image?: string;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryState: string;
  paymentMethod: 'bank_transfer' | 'paystack' | 'cash_on_delivery';
  status: OrderStatus;
  items: OrderItem[];
  subtotalKobo: number;
  discountKobo: number;
  deliveryFeeKobo: number;
  totalKobo: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminUsername: string;
  action: string;
  details: string;
  ipAddress: string;
}

export interface AdminAnalyticsSummary {
  totalRevenueKobo: number;
  totalOrders: number;
  averageOrderValueKobo: number;
  conversionRate: number; // e.g. 3.4%
  salesOverTime: Array<{
    date: string;
    label: string;
    revenueKobo: number;
    ordersCount: number;
  }>;
  topSellingProducts: Array<{
    id: string;
    name: string;
    sku: string;
    unitsSold: number;
    revenueKobo: number;
    image: string;
  }>;
  revenueByCategory: Array<{
    category: Category;
    categoryLabel: string;
    revenueKobo: number;
    percentage: number;
  }>;
  ordersByStatus: Record<OrderStatus, number>;
  customerMetrics: {
    newCustomers: number;
    returningCustomers: number;
    retentionRate: number;
  };
  inventoryAlerts: {
    lowStockCount: number;
    outOfStockCount: number;
    items: Array<{
      id: string;
      name: string;
      sku: string;
      stockCount: number;
      lowStockThreshold: number;
      status: 'low' | 'out';
    }>;
  };
  siteTraffic: {
    totalVisitors: number;
    totalPageViews: number;
    topPages: Array<{
      path: string;
      views: number;
      percentage: number;
    }>;
  };
  recentOrders: AdminOrder[];
}

export interface AdminUser {
  id: string;
  username: string;
  role: 'superadmin' | 'admin';
  lastLoginAt?: string;
}
