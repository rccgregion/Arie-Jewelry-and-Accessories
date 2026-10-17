export type Category = string;

export interface ProductCategory {
  id: string; // unique slug identifier
  name: string; // display name e.g. "Wristwatches"
  slug: string; // url-friendly slug
  description?: string;
  image?: string;
  displayOrder?: number;
  productCount?: number;
  isSystem?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type ActivePage = 'shop' | 'about' | 'admin' | 'admin-login';

export type Currency = 'NGN' | 'USD' | 'GBP' | 'EUR';

export interface Product {
  id: string;
  name: string;
  slug?: string;
  subtitle: string;
  category: string;
  tags?: string[];
  price: number;
  originalPrice?: number;
  description: string;
  craftsmanship: string;
  materials: string[];
  dimensions: string;
  inStock: boolean;
  stockCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isBestseller?: boolean;
  images: string[];
  rating: number;
  reviewsCount: number;
  sku: string;
  specs: Record<string, string>;
  colors?: { name: string; hex: string }[];
  variants?: any;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  monogram?: string;
  giftWrap?: boolean;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  currency: Currency;
  status: 'Confirmed' | 'Processing' | 'Dispatched' | 'Delivered';
  trackingNumber: string;
  shippingDetails: {
    fullName: string;
    email: string;
    phone?: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  deliveryMethod: string;
  paymentMethod: string;
}

export interface FilterOptions {
  category: Category;
  maxPrice: number;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  material?: string;
  searchQuery?: string;
}
