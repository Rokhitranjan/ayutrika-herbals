export type ProductStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface ProductImageDetail {
  id: string;
  url: string;
  altText?: string;
  sortOrder?: number;
  isPrimary?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  category?: string;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  compareAtPrice?: number;
  discount?: number;
  stock: number; // Stock quantity in inventory
  reservedQuantity?: number; // Stock reserved in unfulfilled orders
  lowStockThreshold?: number; // Alert threshold (default 10)
  availableStock?: number; // stock - reservedQuantity
  shortDesc: string;
  shortDescription?: string;
  description?: string;
  fullDesc: string;
  images: string[];
  productImages?: ProductImageDetail[];
  thumbnail?: string;
  ingredients: string[];
  benefits: string[];
  howToUse?: string;
  dosage?: string;
  storage?: string;
  importantInfo?: string;
  weight?: string;
  dimensions?: string;
  productType?: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords: string[];
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  status?: ProductStatus; // DRAFT, PUBLISHED, ARCHIVED
  isActive: boolean; // Backwards compatible with existing checks
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount?: number;
  displayOrder?: number;
}

export interface Ingredient {
  id: string;
  name: string;
  botanicalName: string;
  slug: string;
  image: string;
  description: string;
  traditionalUse: string;
  benefits: string[];
}

export interface Benefit {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  tag?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface UserRecord {
  id: string;
  firstName: string;
  lastName?: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: "customer" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItemRecord {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartRecord {
  id: string;
  userId?: string | null;
  sessionId?: string | null;
  items: CartItemRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface CartSummary {
  items: {
    id: string;
    product: Product;
    quantity: number;
    itemTotal: number;
  }[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  totalQuantity: number;
  appliedCoupon?: Coupon | null;
}

export interface WishlistRecord {
  id: string;
  userId?: string | null;
  sessionId?: string | null;
  productIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PasswordResetToken {
  id: string;
  email: string;
  token: string;
  expiresAt: string;
  usedAt?: string | null;
  createdAt: string;
}

export interface ShippingAddress {
  fullName: string;
  email?: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode?: string;
  pincode?: string;
  country?: string;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "PACKED"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURN_REQUESTED"
  | "RETURNED"
  | "REFUNDED"
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Packed"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled"
  | "Returned"
  | "Refunded";

export type PaymentStatus =
  | "PENDING"
  | "AUTHORIZED"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED"
  | "Pending"
  | "Paid"
  | "Failed"
  | "Refunded";

export interface OrderItem {
  id: string;
  orderId?: string;
  productId: string;
  productName: string;
  productNameSnapshot?: string;
  skuSnapshot?: string;
  priceSnapshot?: number;
  productImage?: string;
  price: number;
  quantity: number;
  subtotal?: number;
  total: number;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  provider: "razorpay" | "cod" | "manual";
  providerOrderId?: string;
  providerPaymentId?: string;
  providerSignature?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  signatureVerified: boolean;
  rawResponse?: any;
  createdAt: string;
  updatedAt: string;
}

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status?: OrderStatus;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  discount: number;
  shippingAmount?: number;
  shippingFee: number;
  taxAmount?: number;
  tax: number;
  totalAmount?: number;
  total: number;
  currency?: string;
  shippingAddressSnapshot?: ShippingAddress;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  payments?: PaymentRecord[];
  payment?: PaymentRecord;
  paymentMethod: string;
  paymentId?: string;
  couponCode?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  notes?: string;
  timeline: OrderTimeline[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId?: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  approved: boolean;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiresAt?: string;
  isActive: boolean;
  usageCount: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string[];
  readingTime: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: number;
  verified: boolean;
  product?: string;
  avatar?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalSpending: number;
  ordersCount: number;
  registrationDate: string;
  lastOrderDate?: string;
  status: "Active" | "Inactive";
}

export interface BrandSettings {
  brandName: string;
  tagline: string;
  brandDescription: string;
  brandStory: string;
  brandPhilosophy: string;
  contactEmail: string;
  contactPhone: string;
  contactWhatsApp: string;
  businessAddress: string;
  gstNumber: string;
  certifications: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  footerText: string;
  copyrightText: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroCtaLink: string;
  heroImage: string;
}
