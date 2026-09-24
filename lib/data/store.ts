import {
  Product,
  Category,
  Ingredient,
  Benefit,
  BlogPost,
  Testimonial,
  Coupon,
  BrandSettings,
  Order,
  OrderItem,
  PaymentRecord,
  ShippingAddress,
  Customer,
  Review,
  OrderStatus,
  PaymentStatus,
  UserRecord,
  Address,
  CartRecord,
  CartItemRecord,
  CartSummary,
  WishlistRecord,
  PasswordResetToken,
} from "../types";
import {
  initialBrandSettings,
  initialCategories,
  initialIngredients,
  initialBenefits,
  initialProducts,
  initialTestimonials,
  initialBlogPosts,
  initialCoupons,
  initialOrders,
} from "./initial-data";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// In-memory global store to guarantee fast access and persistence across hot reloads and serverless executions
declare global {
  var __ayutrika_store__: {
    products: Product[];
    categories: Category[];
    ingredients: Ingredient[];
    benefits: Benefit[];
    blogPosts: BlogPost[];
    testimonials: Testimonial[];
    coupons: Coupon[];
    orders: Order[];
    brandSettings: BrandSettings;
    reviews: Review[];
    users: UserRecord[];
    addresses: Address[];
    carts: CartRecord[];
    wishlists: WishlistRecord[];
    resetTokens: PasswordResetToken[];
  } | undefined;
}

// Initial customer list derived from initial orders
const initialCustomers: Customer[] = [
  {
    id: "cust-1",
    name: "Radhika Mehra",
    email: "radhika.mehra@example.com",
    phone: "+91 98201 44552",
    totalSpending: 2982,
    ordersCount: 1,
    registrationDate: "2026-02-15T10:00:00Z",
    lastOrderDate: "2026-03-01T14:20:00Z",
    status: "Active",
  },
  {
    id: "cust-2",
    name: "Ananya Sharma",
    email: "ananya.sharma@example.com",
    phone: "+91 99100 88231",
    totalSpending: 2588,
    ordersCount: 1,
    registrationDate: "2026-01-20T10:00:00Z",
    lastOrderDate: "2026-03-06T09:15:00Z",
    status: "Active",
  },
  {
    id: "cust-3",
    name: "Kunal Singhal",
    email: "kunal.singhal@example.com",
    phone: "+91 97112 33490",
    totalSpending: 2930,
    ordersCount: 1,
    registrationDate: "2026-02-10T10:00:00Z",
    lastOrderDate: "2026-03-08T10:05:00Z",
    status: "Active",
  },
  {
    id: "cust-4",
    name: "Siddharth Varma",
    email: "siddharth.varma@example.com",
    phone: "+91 98334 11029",
    totalSpending: 4850,
    ordersCount: 2,
    registrationDate: "2026-01-05T10:00:00Z",
    lastOrderDate: "2026-02-28T16:10:00Z",
    status: "Active",
  },
];

const initialReviews: Review[] = [
  {
    id: "rev-1",
    productId: "prod-1",
    customerName: "Dr. Priyamvada Joshi",
    rating: 5,
    title: "Exceptional purity and serene grounding",
    comment: "The finest Ashwagandha powder I have consumed. The stone-milled texture dissolves smoothly in warm almond milk. Deep restorative sleep follows.",
    verified: true,
    approved: true,
    createdAt: "2026-02-12T10:00:00Z",
  },
  {
    id: "rev-2",
    productId: "prod-2",
    customerName: "Siddharth Varma",
    rating: 5,
    title: "Potent golden nectar with royal saffron",
    comment: "The fragrance alone upon opening the amber jar reveals its authenticity. Noticeable relief in morning stiffness and subtle radiant skin glow.",
    verified: true,
    approved: true,
    createdAt: "2026-02-18T10:00:00Z",
  },
  {
    id: "rev-3",
    productId: "prod-3",
    customerName: "Aakash Singhania",
    rating: 5,
    title: "Miraculous texture and refined aroma",
    comment: "A few drops nightly have significantly refined my skin tone. Does not feel greasy. Absorbs like liquid silk.",
    verified: true,
    approved: true,
    createdAt: "2026-02-24T10:00:00Z",
  },
  {
    id: "rev-4",
    productId: "prod-13",
    customerName: "Vikramaditya Rao",
    rating: 5,
    title: "True classical Chyawanprash without sugar overload",
    comment: "The richness of Vedic A2 ghee and wild amla is apparent from the first spoonful. An invigorating morning staple for the whole family.",
    verified: true,
    approved: true,
    createdAt: "2026-02-26T10:00:00Z",
  },
];

const initialUsers: UserRecord[] = [
  {
    id: "user-cust-1",
    firstName: "Radhika",
    lastName: "Mehra",
    name: "Radhika Mehra",
    email: "radhika.mehra@example.com",
    phone: "+91 98201 44552",
    passwordHash: bcrypt.hashSync("Ayutrika@2026!", 10),
    role: "customer",
    createdAt: "2026-02-15T10:00:00Z",
    updatedAt: "2026-02-15T10:00:00Z",
  },
  {
    id: "user-cust-2",
    firstName: "Ananya",
    lastName: "Sharma",
    name: "Ananya Sharma",
    email: "ananya.sharma@example.com",
    phone: "+91 99100 88231",
    passwordHash: bcrypt.hashSync("Ayutrika@2026!", 10),
    role: "customer",
    createdAt: "2026-01-20T10:00:00Z",
    updatedAt: "2026-01-20T10:00:00Z",
  },
];

const initialAddresses: Address[] = [
  {
    id: "addr-1",
    userId: "user-cust-1",
    fullName: "Radhika Mehra",
    phone: "+91 98201 44552",
    addressLine1: "Flat 402, Lotus Heritage Apartments",
    addressLine2: "14th Road, Khar West",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400052",
    country: "India",
    isDefault: true,
    createdAt: "2026-02-15T10:00:00Z",
    updatedAt: "2026-02-15T10:00:00Z",
  },
];

function getStore() {
  if (!global.__ayutrika_store__) {
    // Try to load from persistent JSON file if available, otherwise initialize default
    const dataFilePath = path.join(process.cwd(), "ayutrika-data.json");
    if (fs.existsSync(dataFilePath)) {
      try {
        const fileContent = fs.readFileSync(dataFilePath, "utf-8");
        global.__ayutrika_store__ = JSON.parse(fileContent);
      } catch {
        // Fallback to fresh defaults
      }
    }

    if (!global.__ayutrika_store__) {
      global.__ayutrika_store__ = {
        products: initialProducts.map((p) => ({
          ...p,
          status: p.status || (p.isActive ? "PUBLISHED" : "ARCHIVED"),
          reservedQuantity: p.reservedQuantity || 0,
          lowStockThreshold: p.lowStockThreshold || 10,
          availableStock: (p.stock || 0) - (p.reservedQuantity || 0),
        })),
        categories: initialCategories,
        ingredients: initialIngredients,
        benefits: initialBenefits,
        blogPosts: initialBlogPosts,
        testimonials: initialTestimonials,
        coupons: initialCoupons,
        orders: initialOrders,
        brandSettings: initialBrandSettings,
        reviews: initialReviews,
        users: initialUsers,
        addresses: initialAddresses,
        carts: [],
        wishlists: [],
        resetTokens: [],
      };
    }
  }

  // Ensure all products have status and available stock computed
  if (global.__ayutrika_store__?.products) {
    for (const p of global.__ayutrika_store__.products) {
      if (!p.status) {
        p.status = p.isActive ? "PUBLISHED" : "ARCHIVED";
      }
      if (p.reservedQuantity === undefined) p.reservedQuantity = 0;
      if (p.lowStockThreshold === undefined) p.lowStockThreshold = 10;
      p.availableStock = (p.stock || 0) - (p.reservedQuantity || 0);
    }
  }

  // Ensure new Stage 4 collections exist even if loaded from older JSON
  if (!global.__ayutrika_store__.users) {
    global.__ayutrika_store__.users = initialUsers;
  }
  if (!global.__ayutrika_store__.addresses) {
    global.__ayutrika_store__.addresses = initialAddresses;
  }
  if (!global.__ayutrika_store__.carts) {
    global.__ayutrika_store__.carts = [];
  }
  if (!global.__ayutrika_store__.wishlists) {
    global.__ayutrika_store__.wishlists = [];
  }
  if (!global.__ayutrika_store__.resetTokens) {
    global.__ayutrika_store__.resetTokens = [];
  }

  return global.__ayutrika_store__;
}

function persistStore() {
  try {
    const dataFilePath = path.join(process.cwd(), "ayutrika-data.json");
    fs.writeFileSync(dataFilePath, JSON.stringify(global.__ayutrika_store__, null, 2), "utf-8");
  } catch (err) {
    // Read-only filesystem in some serverless environments, graceful in-memory fallback
  }
}

// ==================== PRODUCTS ====================
export async function getProducts(options?: {
  categoryId?: string;
  categorySlug?: string;
  benefit?: string;
  ingredient?: string;
  search?: string;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  sortBy?: string;
  inStockOnly?: boolean;
  stockStatus?: "all" | "in" | "low" | "out";
  status?: string;
  includeDrafts?: boolean;
  priceMin?: number;
  priceMax?: number;
}): Promise<Product[]> {
  const store = getStore();

  let list = [...store.products].filter((p) => {
    // Public customers only see PUBLISHED products
    if (options?.includeDrafts) {
      return true;
    }
    const isPub = p.status ? p.status === "PUBLISHED" : p.isActive;
    return isPub && p.status !== "ARCHIVED";
  });

  // Status Filter (Admin queries)
  if (options?.status && options.status !== "all") {
    list = list.filter((p) => {
      const currentStatus = p.status || (p.isActive ? "PUBLISHED" : "ARCHIVED");
      return currentStatus === options.status;
    });
  }

  if (options?.categoryId) {
    list = list.filter((p) => p.categoryId === options.categoryId);
  }
  if (options?.categorySlug) {
    const cat = store.categories.find((c) => c.slug === options.categorySlug);
    if (cat) {
      list = list.filter((p) => p.categoryId === cat.id);
    }
  }
  if (options?.benefit) {
    list = list.filter((p) =>
      p.benefits.some((b) => b.toLowerCase().includes(options.benefit!.toLowerCase()))
    );
  }
  if (options?.ingredient) {
    list = list.filter((p) =>
      p.ingredients.some((i) => i.toLowerCase().includes(options.ingredient!.toLowerCase()))
    );
  }
  if (options?.featured) {
    list = list.filter((p) => p.isFeatured);
  }
  if (options?.bestSeller) {
    list = list.filter((p) => p.isBestSeller);
  }
  if (options?.newArrival) {
    list = list.filter((p) => p.isNewArrival);
  }
  if (options?.inStockOnly) {
    list = list.filter((p) => (p.availableStock ?? p.stock) > 0);
  }

  // Stock Status Filter
  if (options?.stockStatus && options.stockStatus !== "all") {
    list = list.filter((p) => {
      const avail = p.availableStock ?? (p.stock - (p.reservedQuantity || 0));
      const threshold = p.lowStockThreshold || 10;
      if (options.stockStatus === "out") return avail <= 0;
      if (options.stockStatus === "low") return avail > 0 && avail <= threshold;
      if (options.stockStatus === "in") return avail > threshold;
      return true;
    });
  }

  if (options?.priceMin !== undefined) {
    list = list.filter((p) => p.price >= options.priceMin!);
  }
  if (options?.priceMax !== undefined) {
    list = list.filter((p) => p.price <= options.priceMax!);
  }
  if (options?.search) {
    const q = options.search.toLowerCase().trim();
    list = list.filter((p) => {
      const cat = store.categories.find((c) => c.id === p.categoryId);
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (cat ? cat.name.toLowerCase().includes(q) : false) ||
        p.shortDesc.toLowerCase().includes(q) ||
        p.fullDesc.toLowerCase().includes(q) ||
        p.ingredients.some((i) => i.toLowerCase().includes(q)) ||
        p.benefits.some((b) => b.toLowerCase().includes(q)) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }

  // Sorting
  if (options?.sortBy) {
    switch (options.sortBy) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "bestselling":
        list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        break;
      default:
        // Featured
        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }
  }

  return list;
}

export async function getAllAdminProducts(): Promise<Product[]> {
  const store = getStore();
  return [...store.products].map((p) => ({
    ...p,
    availableStock: (p.stock || 0) - (p.reservedQuantity || 0),
  }));
}

export async function getProductBySlug(slug: string, preview: boolean = false): Promise<Product | null> {
  const store = getStore();
  const product = store.products.find((p) => p.slug === slug);
  if (!product) return null;
  // If preview is active (Admin), allow viewing draft formulations
  if (preview) return product;
  const isPub = product.status ? product.status === "PUBLISHED" : product.isActive;
  return isPub && product.status !== "ARCHIVED" ? product : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const store = getStore();
  const product = store.products.find((p) => p.id === id);
  if (!product) return null;
  return {
    ...product,
    availableStock: (product.stock || 0) - (product.reservedQuantity || 0),
  };
}

export async function createProduct(data: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
  const store = getStore();
  const stock = Number(data.stock) || 0;
  const reserved = Number(data.reservedQuantity) || 0;
  const status = data.status || "PUBLISHED";
  const newProduct: Product = {
    ...data,
    status,
    isActive: status === "PUBLISHED",
    stock,
    reservedQuantity: reserved,
    lowStockThreshold: Number(data.lowStockThreshold) || 10,
    availableStock: stock - reserved,
    id: `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.products.unshift(newProduct);
  persistStore();
  return newProduct;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product | null> {
  const store = getStore();
  const index = store.products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const current = store.products[index];
  const stock = data.stock !== undefined ? Number(data.stock) : current.stock;
  const reserved = data.reservedQuantity !== undefined ? Number(data.reservedQuantity) : (current.reservedQuantity || 0);
  const status = data.status || current.status || (current.isActive ? "PUBLISHED" : "ARCHIVED");
  const isActive = status === "PUBLISHED";

  store.products[index] = {
    ...current,
    ...data,
    status,
    isActive,
    stock,
    reservedQuantity: reserved,
    lowStockThreshold: data.lowStockThreshold !== undefined ? Number(data.lowStockThreshold) : (current.lowStockThreshold || 10),
    availableStock: stock - reserved,
    updatedAt: new Date().toISOString(),
  };
  persistStore();
  return store.products[index];
}

export async function duplicateProduct(id: string): Promise<Product | null> {
  const store = getStore();
  const original = store.products.find((p) => p.id === id);
  if (!original) return null;

  const suffix = Math.floor(1000 + Math.random() * 9000);
  const duplicated: Product = {
    ...original,
    id: `prod-${Date.now()}`,
    name: `${original.name} (Copy)`,
    sku: `${original.sku}-COPY-${suffix}`,
    slug: `${original.slug}-copy-${suffix}`,
    status: "DRAFT",
    isActive: false,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.products.unshift(duplicated);
  persistStore();
  return duplicated;
}

export async function archiveProduct(id: string): Promise<Product | null> {
  return updateProduct(id, { status: "ARCHIVED", isActive: false });
}

export async function publishProduct(id: string): Promise<Product | null> {
  return updateProduct(id, { status: "PUBLISHED", isActive: true });
}

export async function unpublishProduct(id: string): Promise<Product | null> {
  return updateProduct(id, { status: "DRAFT", isActive: false });
}

export async function deleteProduct(id: string): Promise<boolean> {
  const store = getStore();
  const initialLen = store.products.length;
  store.products = store.products.filter((p) => p.id !== id);
  const deleted = store.products.length < initialLen;
  if (deleted) persistStore();
  return deleted;
}

export async function getRelatedProducts(productId: string, limit: number = 4): Promise<Product[]> {
  const store = getStore();
  const target = store.products.find((p) => p.id === productId);
  if (!target) return [];

  const candidates = store.products.filter(
    (p) => p.id !== productId && (p.status === "PUBLISHED" || (!p.status && p.isActive))
  );

  const scored = candidates.map((p) => {
    let score = 0;
    if (p.categoryId === target.categoryId) score += 4;
    const sharedIngredients = p.ingredients.filter((i) => target.ingredients.includes(i));
    score += sharedIngredients.length * 3;
    const sharedBenefits = p.benefits.filter((b) => target.benefits.includes(b));
    score += sharedBenefits.length * 2;
    return { product: p, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.product);
}

// ==================== CATEGORIES ====================
export async function getCategories(): Promise<Category[]> {
  const store = getStore();
  // Dynamically update product counts
  return store.categories.map((c) => ({
    ...c,
    productCount: store.products.filter((p) => p.categoryId === c.id && p.isActive).length,
  }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const store = getStore();
  const cat = store.categories.find((c) => c.slug === slug);
  if (!cat) return null;
  return {
    ...cat,
    productCount: store.products.filter((p) => p.categoryId === cat.id && p.isActive).length,
  };
}

export async function createCategory(data: Omit<Category, "id">): Promise<Category> {
  const store = getStore();
  const newCategory: Category = {
    ...data,
    id: `cat-${Date.now()}`,
  };
  store.categories.push(newCategory);
  persistStore();
  return newCategory;
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<Category | null> {
  const store = getStore();
  const idx = store.categories.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  store.categories[idx] = { ...store.categories[idx], ...data };
  persistStore();
  return store.categories[idx];
}

export async function deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
  const store = getStore();
  const cat = store.categories.find((c) => c.id === id);
  if (!cat) return { success: false, error: "Category not found" };

  const activeProducts = store.products.filter(
    (p) => p.categoryId === id && p.status !== "ARCHIVED"
  );
  if (activeProducts.length > 0) {
    return {
      success: false,
      error: `Cannot delete category "${cat.name}" because it contains ${activeProducts.length} active formulation(s). Please reassign or archive them first.`,
    };
  }

  store.categories = store.categories.filter((c) => c.id !== id);
  persistStore();
  return { success: true };
}

// ==================== INGREDIENTS ====================
export async function getIngredients(): Promise<Ingredient[]> {
  const store = getStore();
  return [...store.ingredients];
}

export async function getIngredientBySlug(slug: string): Promise<Ingredient | null> {
  const store = getStore();
  return store.ingredients.find((i) => i.slug === slug) || null;
}

export async function createIngredient(data: Omit<Ingredient, "id">): Promise<Ingredient> {
  const store = getStore();
  const newIng: Ingredient = {
    ...data,
    id: `ing-${Date.now()}`,
  };
  store.ingredients.push(newIng);
  persistStore();
  return newIng;
}

export async function updateIngredient(id: string, data: Partial<Ingredient>): Promise<Ingredient | null> {
  const store = getStore();
  const idx = store.ingredients.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  store.ingredients[idx] = { ...store.ingredients[idx], ...data };
  persistStore();
  return store.ingredients[idx];
}

export async function deleteIngredient(id: string): Promise<{ success: boolean; error?: string }> {
  const store = getStore();
  const ing = store.ingredients.find((i) => i.id === id);
  if (!ing) return { success: false, error: "Ingredient not found" };
  store.ingredients = store.ingredients.filter((i) => i.id !== id);
  persistStore();
  return { success: true };
}

// ==================== BENEFITS ====================
export async function getBenefits(): Promise<Benefit[]> {
  const store = getStore();
  return [...store.benefits];
}

export async function getBenefitBySlug(slug: string): Promise<Benefit | null> {
  const store = getStore();
  return store.benefits.find((b) => b.slug === slug) || null;
}

export async function createBenefit(data: Omit<Benefit, "id">): Promise<Benefit> {
  const store = getStore();
  const newBen: Benefit = { ...data, id: `ben-${Date.now()}` };
  store.benefits.push(newBen);
  persistStore();
  return newBen;
}

export async function updateBenefit(id: string, data: Partial<Benefit>): Promise<Benefit | null> {
  const store = getStore();
  const idx = store.benefits.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  store.benefits[idx] = { ...store.benefits[idx], ...data };
  persistStore();
  return store.benefits[idx];
}

export async function deleteBenefit(id: string): Promise<{ success: boolean; error?: string }> {
  const store = getStore();
  const ben = store.benefits.find((b) => b.id === id);
  if (!ben) return { success: false, error: "Benefit not found" };
  store.benefits = store.benefits.filter((b) => b.id !== id);
  persistStore();
  return { success: true };
}

// ==================== ORDERS ====================

export function generateHumanOrderNumber(): string {
  const store = getStore();
  const year = new Date().getFullYear();
  const existingCount = store.orders.length + 1;
  const padded = String(existingCount).padStart(6, "0");
  const candidate = `AYU-${year}-${padded}`;
  // Ensure uniqueness in rare case of collisions
  const exists = store.orders.some((o) => o.orderNumber === candidate);
  if (exists) {
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `AYU-${year}-${padded}-${rand}`;
  }
  return candidate;
}

export async function getOrders(): Promise<Order[]> {
  const store = getStore();
  return [...store.orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export const getStoreOrders = getOrders;

export async function getOrderById(id: string): Promise<Order | null> {
  const store = getStore();
  return store.orders.find((o) => o.id === id) || null;
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const store = getStore();
  const normalized = orderNumber.trim().toLowerCase();
  return store.orders.find((o) => o.orderNumber.toLowerCase() === normalized || o.id === orderNumber) || null;
}

export async function getUserOrders(userId: string, email?: string): Promise<Order[]> {
  const store = getStore();
  const normalizedEmail = email?.trim().toLowerCase();
  return store.orders
    .filter(
      (o) =>
        (o.userId && o.userId === userId) ||
        (normalizedEmail && o.customerEmail?.trim().toLowerCase() === normalizedEmail)
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getCustomerOrder(
  orderIdentifier: string,
  userId: string,
  email?: string
): Promise<Order | null> {
  const store = getStore();
  const normalizedIdent = orderIdentifier.trim().toLowerCase();
  const normalizedEmail = email?.trim().toLowerCase();

  const order = store.orders.find(
    (o) => o.id === orderIdentifier || o.orderNumber.toLowerCase() === normalizedIdent
  );
  if (!order) return null;

  // Strict ownership verification: Customer A cannot see Customer B's order
  const isOwner =
    (order.userId && order.userId === userId) ||
    (normalizedEmail && order.customerEmail?.trim().toLowerCase() === normalizedEmail);

  if (!isOwner) {
    return null;
  }
  return order;
}

export async function createOrder(
  data: Partial<Order> & {
    customerName: string;
    customerEmail: string;
    shippingAddress: ShippingAddress;
    items: OrderItem[];
    subtotal: number;
    total: number;
    paymentMethod: string;
    sessionId?: string;
  }
): Promise<Order> {
  const store = getStore();

  // 1. Idempotency Check: if paymentId or providerPaymentId was already recorded, return existing order
  const paymentIdToCheck = data.paymentId || data.payment?.providerPaymentId;
  if (paymentIdToCheck && !paymentIdToCheck.includes("mock_unpaid")) {
    const existing = store.orders.find(
      (o) =>
        o.paymentId === paymentIdToCheck ||
        o.payments?.some((p) => p.providerPaymentId === paymentIdToCheck)
    );
    if (existing) {
      return existing;
    }
  }

  // 2. Authoritative Snapshots for Items
  const itemsWithSnapshots: OrderItem[] = data.items.map((it, idx) => {
    const originalProd = store.products.find((p) => p.id === it.productId);
    const priceSnapshot = it.priceSnapshot || it.price || originalProd?.price || 0;
    const subtotal = it.subtotal || priceSnapshot * it.quantity;

    return {
      id: it.id || `item-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`,
      orderId: "", // will be linked below
      productId: it.productId,
      productName: it.productName || originalProd?.name || "Ayurvedic Formulation",
      productNameSnapshot: it.productNameSnapshot || originalProd?.name || it.productName || "Ayurvedic Formulation",
      skuSnapshot: it.skuSnapshot || originalProd?.sku || "SKU-AYU",
      priceSnapshot,
      productImage: it.productImage || originalProd?.images?.[0] || originalProd?.thumbnail,
      price: priceSnapshot,
      quantity: it.quantity,
      subtotal,
      total: subtotal,
    };
  });

  const orderId = `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const orderNumber = data.orderNumber || generateHumanOrderNumber();

  itemsWithSnapshots.forEach((it) => {
    it.orderId = orderId;
  });

  // 3. Payment Record
  const initialPayment: PaymentRecord = data.payment
    ? { ...data.payment, orderId }
    : {
        id: `pay-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        orderId,
        provider: data.paymentMethod?.toLowerCase().includes("razorpay")
          ? "razorpay"
          : data.paymentMethod?.toLowerCase().includes("cod") || data.paymentMethod?.toLowerCase().includes("cash")
          ? "cod"
          : "manual",
        providerOrderId: undefined,
        providerPaymentId: data.paymentId,
        amount: data.totalAmount || data.total,
        currency: data.currency || "INR",
        status: (data.paymentStatus as any) || "PENDING",
        signatureVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

  const initialStatus: OrderStatus = data.status || data.orderStatus || "CONFIRMED";
  const initialPaymentStatus: PaymentStatus = data.paymentStatus || "PENDING";

  const newOrder: Order = {
    id: orderId,
    orderNumber,
    userId: data.userId || null,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    customerPhone: data.customerPhone || data.shippingAddress.phone,
    status: initialStatus,
    orderStatus: initialStatus,
    paymentStatus: initialPaymentStatus,
    subtotal: data.subtotal,
    discount: data.discount || 0,
    shippingAmount: data.shippingAmount !== undefined ? data.shippingAmount : (data.shippingFee || 0),
    shippingFee: data.shippingFee !== undefined ? data.shippingFee : (data.shippingAmount || 0),
    taxAmount: data.taxAmount !== undefined ? data.taxAmount : (data.tax || 0),
    tax: data.tax !== undefined ? data.tax : (data.taxAmount || 0),
    totalAmount: data.totalAmount !== undefined ? data.totalAmount : (data.total || 0),
    total: data.total !== undefined ? data.total : (data.totalAmount || 0),
    currency: data.currency || "INR",
    shippingAddress: { ...data.shippingAddress },
    shippingAddressSnapshot: { ...data.shippingAddress },
    items: itemsWithSnapshots,
    payments: data.payments || [initialPayment],
    payment: initialPayment,
    paymentMethod: data.paymentMethod || "Razorpay",
    paymentId: initialPayment.providerPaymentId,
    couponCode: data.couponCode,
    trackingNumber: data.trackingNumber || `DEL-AYU-${Math.floor(100000 + Math.random() * 900000)}`,
    trackingUrl: data.trackingUrl || "https://track.delhivery.com",
    notes: data.notes || "",
    timeline: data.timeline || [
      {
        status: "CONFIRMED",
        timestamp: new Date().toISOString(),
        note: "Order confirmed and verified by Ayutrika Apothecary",
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.orders.unshift(newOrder);

  // 4. Safely deduct inventory for purchased products
  for (const item of newOrder.items) {
    const prod = store.products.find((p) => p.id === item.productId);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - item.quantity);
    }
  }

  // 5. Clean up purchased items from customer's active cart (Preserving unrelated items)
  if (newOrder.userId || data.sessionId) {
    const activeCart = findCart(store, newOrder.userId, data.sessionId);
    if (activeCart && activeCart.items.length > 0) {
      const purchasedSet = new Set(newOrder.items.map((i) => i.productId));
      activeCart.items = activeCart.items.filter((ci) => !purchasedSet.has(ci.productId));
      activeCart.updatedAt = new Date().toISOString();
    }
  }

  persistStore();
  return newOrder;
}

export async function updateOrderStatus(
  id: string,
  orderStatus: OrderStatus,
  trackingNumber?: string,
  note?: string
): Promise<Order | null> {
  const store = getStore();
  const order = store.orders.find((o) => o.id === id || o.orderNumber === id);
  if (!order) return null;

  order.orderStatus = orderStatus;
  order.status = orderStatus;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  order.updatedAt = new Date().toISOString();

  if (!order.timeline) order.timeline = [];
  order.timeline.push({
    status: orderStatus,
    timestamp: new Date().toISOString(),
    note: note || `Status updated to ${orderStatus}`,
  });

  persistStore();
  return order;
}

export async function updateOrderPaymentStatus(
  id: string,
  paymentStatus: PaymentStatus,
  paymentRecord?: Partial<PaymentRecord>
): Promise<Order | null> {
  const store = getStore();
  const order = store.orders.find((o) => o.id === id || o.orderNumber === id);
  if (!order) return null;

  order.paymentStatus = paymentStatus;
  order.updatedAt = new Date().toISOString();

  if (paymentRecord && order.payment) {
    order.payment = { ...order.payment, ...paymentRecord };
  }

  persistStore();
  return order;
}

// ==================== COUPONS ====================
export async function getCoupons(): Promise<Coupon[]> {
  const store = getStore();
  return [...store.coupons];
}

export async function validateCoupon(code: string, subtotal: number): Promise<{ valid: boolean; discount: number; message: string }> {
  const store = getStore();
  const coupon = store.coupons.find(
    (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive
  );

  if (!coupon) {
    return { valid: false, discount: 0, message: "Invalid or inactive promo code." };
  }

  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
    return {
      valid: false,
      discount: 0,
      message: `Minimum order value of ₹${coupon.minOrderValue} required for this code.`,
    };
  }

  let discount = 0;
  if (coupon.discountType === "percentage") {
    discount = Math.round((subtotal * coupon.discountValue) / 100);
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.discountValue;
  }

  return { valid: true, discount, message: `Promo code applied successfully!` };
}

export async function createCoupon(data: Omit<Coupon, "id" | "usageCount">): Promise<Coupon> {
  const store = getStore();
  const newCoupon: Coupon = {
    ...data,
    id: `coup-${Date.now()}`,
    usageCount: 0,
  };
  store.coupons.push(newCoupon);
  persistStore();
  return newCoupon;
}

export async function deleteCoupon(id: string): Promise<boolean> {
  const store = getStore();
  const initialLen = store.coupons.length;
  store.coupons = store.coupons.filter((c) => c.id !== id);
  const deleted = store.coupons.length < initialLen;
  if (deleted) persistStore();
  return deleted;
}

// ==================== BLOG POSTS ====================
export async function getBlogPosts(): Promise<BlogPost[]> {
  const store = getStore();
  return store.blogPosts.filter((b) => b.isPublished);
}

export async function getAllAdminBlogPosts(): Promise<BlogPost[]> {
  const store = getStore();
  return [...store.blogPosts];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const store = getStore();
  return store.blogPosts.find((b) => b.slug === slug) || null;
}

export async function createBlogPost(data: Omit<BlogPost, "id" | "createdAt" | "updatedAt">): Promise<BlogPost> {
  const store = getStore();
  const newPost: BlogPost = {
    ...data,
    id: `blog-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.blogPosts.unshift(newPost);
  persistStore();
  return newPost;
}

export async function updateBlogPost(id: string, data: Partial<BlogPost>): Promise<BlogPost | null> {
  const store = getStore();
  const idx = store.blogPosts.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  store.blogPosts[idx] = {
    ...store.blogPosts[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  persistStore();
  return store.blogPosts[idx];
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  const store = getStore();
  const initialLen = store.blogPosts.length;
  store.blogPosts = store.blogPosts.filter((b) => b.id !== id);
  const deleted = store.blogPosts.length < initialLen;
  if (deleted) persistStore();
  return deleted;
}

// ==================== BRAND SETTINGS ====================
export async function getBrandSettings(): Promise<BrandSettings> {
  const store = getStore();
  return { ...store.brandSettings };
}

export async function updateBrandSettings(data: Partial<BrandSettings>): Promise<BrandSettings> {
  const store = getStore();
  store.brandSettings = {
    ...store.brandSettings,
    ...data,
  };
  persistStore();
  return store.brandSettings;
}

// ==================== TESTIMONIALS ====================
export async function getTestimonials(): Promise<Testimonial[]> {
  const store = getStore();
  return [...store.testimonials];
}

export async function createTestimonial(data: Omit<Testimonial, "id">): Promise<Testimonial> {
  const store = getStore();
  const newTest: Testimonial = { ...data, id: `test-${Date.now()}` };
  store.testimonials.push(newTest);
  persistStore();
  return newTest;
}

// ==================== REVIEWS ====================
export async function getReviewsByProduct(productId: string): Promise<Review[]> {
  const store = getStore();
  return store.reviews.filter((r) => r.productId === productId && r.approved);
}

export async function getAllAdminReviews(): Promise<Review[]> {
  const store = getStore();
  return [...store.reviews];
}

export async function addReview(data: Omit<Review, "id" | "createdAt" | "approved">): Promise<Review> {
  const store = getStore();
  const newReview: Review = {
    ...data,
    id: `rev-${Date.now()}`,
    approved: true,
    createdAt: new Date().toISOString(),
  };
  store.reviews.unshift(newReview);

  // Recalculate product rating
  const productReviews = store.reviews.filter((r) => r.productId === data.productId);
  const avg = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
  const prod = store.products.find((p) => p.id === data.productId);
  if (prod) {
    prod.rating = parseFloat(avg.toFixed(2));
    prod.reviewCount = productReviews.length;
  }

  persistStore();
  return newReview;
}

// ==================== CUSTOMERS & ANALYTICS ====================
export async function getCustomers(): Promise<Customer[]> {
  const store = getStore();
  // Build dynamic customer summary from orders
  const map = new Map<string, Customer>();

  // Seed with initial customers
  for (const c of initialCustomers) {
    map.set(c.email.toLowerCase(), { ...c });
  }

  // Update from live orders
  for (const order of store.orders) {
    const email = order.customerEmail.toLowerCase();
    const existing = map.get(email);
    if (existing) {
      existing.totalSpending += order.total;
      existing.ordersCount += 1;
      existing.lastOrderDate = order.createdAt;
    } else {
      map.set(email, {
        id: `cust-${Date.now()}`,
        name: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone,
        totalSpending: order.total,
        ordersCount: 1,
        registrationDate: order.createdAt,
        lastOrderDate: order.createdAt,
        status: "Active",
      });
    }
  }

  return Array.from(map.values());
}

export async function getAnalytics() {
  const store = getStore();
  const orders = store.orders;
  const totalSales = orders.reduce((sum, o) => sum + (o.paymentStatus === "Paid" ? o.total : 0), 0);
  const totalOrders = orders.length;
  const customers = await getCustomers();
  const avgOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

  // Best selling products
  const productSalesMap = new Map<string, { count: number; revenue: number }>();
  for (const order of orders) {
    for (const item of order.items) {
      const cur = productSalesMap.get(item.productId) || { count: 0, revenue: 0 };
      cur.count += item.quantity;
      cur.revenue += item.total;
      productSalesMap.set(item.productId, cur);
    }
  }

  const bestSelling = store.products
    .map((p) => {
      const sales = productSalesMap.get(p.id) || { count: 0, revenue: 0 };
      return {
        product: p,
        unitsSold: sales.count + (p.isBestSeller ? 45 : 12),
        totalRevenue: sales.revenue + (p.isBestSeller ? 45 : 12) * p.price,
      };
    })
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 5);

  const lowStock = store.products.filter((p) => p.stock < 20);

  return {
    totalSales,
    totalOrders,
    customersCount: customers.length,
    avgOrderValue,
    bestSelling,
    lowStock,
  };
}

// ==================== STAGE 4: CUSTOMER USERS & AUTH ====================

export async function createUser(data: {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  password?: string;
  passwordHash?: string;
  role?: "customer" | "admin";
}): Promise<UserRecord> {
  const store = getStore();
  const normalizedEmail = data.email.trim().toLowerCase();

  const existing = store.users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    throw new Error("A patron account already exists with this email address.");
  }

  let finalHash = data.passwordHash;
  if (!finalHash) {
    if (!data.password) {
      throw new Error("Password is required to create an account.");
    }
    const saltRounds = 10;
    finalHash = await bcrypt.hash(data.password, saltRounds);
  }

  const fullName = `${data.firstName.trim()} ${data.lastName ? data.lastName.trim() : ""}`.trim();

  const newUser: UserRecord = {
    id: `user-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    firstName: data.firstName.trim(),
    lastName: data.lastName ? data.lastName.trim() : undefined,
    name: fullName,
    email: normalizedEmail,
    phone: data.phone?.trim(),
    passwordHash: finalHash,
    role: data.role || "customer",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.users.push(newUser);
  persistStore();
  return newUser;
}

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const store = getStore();
  const normalizedEmail = email.trim().toLowerCase();
  const user = store.users.find((u) => u.email.toLowerCase() === normalizedEmail);
  return user || null;
}

export async function getUserById(id: string): Promise<UserRecord | null> {
  const store = getStore();
  const user = store.users.find((u) => u.id === id);
  return user || null;
}

export async function updateUserProfile(
  id: string,
  data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
  }
): Promise<UserRecord | null> {
  const store = getStore();
  const idx = store.users.findIndex((u) => u.id === id);
  if (idx === -1) return null;

  const current = store.users[idx];
  if (data.email && data.email.trim().toLowerCase() !== current.email.toLowerCase()) {
    const emailConflict = store.users.find(
      (u) => u.id !== id && u.email.toLowerCase() === data.email!.trim().toLowerCase()
    );
    if (emailConflict) {
      throw new Error("Another patron account is already registered with this email.");
    }
    current.email = data.email.trim().toLowerCase();
  }

  if (data.firstName !== undefined) current.firstName = data.firstName.trim();
  if (data.lastName !== undefined) current.lastName = data.lastName.trim();
  current.name = `${current.firstName} ${current.lastName || ""}`.trim();
  if (data.phone !== undefined) current.phone = data.phone.trim();
  current.updatedAt = new Date().toISOString();

  store.users[idx] = current;
  persistStore();
  return current;
}

export async function updateUserPassword(id: string, newPasswordHash: string): Promise<boolean> {
  const store = getStore();
  const idx = store.users.findIndex((u) => u.id === id);
  if (idx === -1) return false;

  store.users[idx].passwordHash = newPasswordHash;
  store.users[idx].updatedAt = new Date().toISOString();
  persistStore();
  return true;
}

export async function getAllUsers(): Promise<UserRecord[]> {
  const store = getStore();
  return [...store.users];
}

// ==================== STAGE 4: ADDRESS BOOK ====================

export async function getUserAddresses(userId: string): Promise<Address[]> {
  const store = getStore();
  return store.addresses.filter((a) => a.userId === userId);
}

export async function getAddressById(id: string, userId: string): Promise<Address | null> {
  const store = getStore();
  const address = store.addresses.find((a) => a.id === id && a.userId === userId);
  return address || null;
}

export async function createAddress(
  userId: string,
  data: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
    isDefault?: boolean;
  }
): Promise<Address> {
  const store = getStore();
  const existingUserAddresses = store.addresses.filter((a) => a.userId === userId);
  const isDefault = data.isDefault || existingUserAddresses.length === 0;

  if (isDefault) {
    for (const a of store.addresses) {
      if (a.userId === userId) a.isDefault = false;
    }
  }

  const newAddress: Address = {
    id: `addr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userId,
    fullName: data.fullName.trim(),
    phone: data.phone.trim(),
    addressLine1: data.addressLine1.trim(),
    addressLine2: data.addressLine2?.trim(),
    city: data.city.trim(),
    state: data.state.trim(),
    postalCode: data.postalCode.trim(),
    country: data.country?.trim() || "India",
    isDefault,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.addresses.push(newAddress);
  persistStore();
  return newAddress;
}

export async function updateAddress(
  id: string,
  userId: string,
  data: Partial<{
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
    isDefault?: boolean;
  }>
): Promise<Address | null> {
  const store = getStore();
  const idx = store.addresses.findIndex((a) => a.id === id && a.userId === userId);
  if (idx === -1) return null;

  if (data.isDefault) {
    for (const a of store.addresses) {
      if (a.userId === userId) a.isDefault = false;
    }
  }

  const current = store.addresses[idx];
  const updated: Address = {
    ...current,
    fullName: data.fullName !== undefined ? data.fullName.trim() : current.fullName,
    phone: data.phone !== undefined ? data.phone.trim() : current.phone,
    addressLine1: data.addressLine1 !== undefined ? data.addressLine1.trim() : current.addressLine1,
    addressLine2: data.addressLine2 !== undefined ? data.addressLine2.trim() : current.addressLine2,
    city: data.city !== undefined ? data.city.trim() : current.city,
    state: data.state !== undefined ? data.state.trim() : current.state,
    postalCode: data.postalCode !== undefined ? data.postalCode.trim() : current.postalCode,
    country: data.country !== undefined ? data.country.trim() : current.country,
    isDefault: data.isDefault !== undefined ? data.isDefault : current.isDefault,
    updatedAt: new Date().toISOString(),
  };

  store.addresses[idx] = updated;
  persistStore();
  return updated;
}

export async function deleteAddress(id: string, userId: string): Promise<boolean> {
  const store = getStore();
  const idx = store.addresses.findIndex((a) => a.id === id && a.userId === userId);
  if (idx === -1) return false;

  const wasDefault = store.addresses[idx].isDefault;
  store.addresses.splice(idx, 1);

  if (wasDefault) {
    const remaining = store.addresses.filter((a) => a.userId === userId);
    if (remaining.length > 0) {
      remaining[0].isDefault = true;
    }
  }

  persistStore();
  return true;
}

export async function setDefaultAddress(id: string, userId: string): Promise<boolean> {
  const store = getStore();
  let found = false;
  for (const a of store.addresses) {
    if (a.userId === userId) {
      if (a.id === id) {
        a.isDefault = true;
        found = true;
      } else {
        a.isDefault = false;
      }
    }
  }
  if (found) persistStore();
  return found;
}

// ==================== STAGE 4: CART SYSTEM ====================

function findCart(store: any, userId?: string | null, sessionId?: string | null): CartRecord | null {
  if (userId) {
    const userCart = store.carts.find((c: CartRecord) => c.userId === userId);
    if (userCart) return userCart;
  }
  if (sessionId) {
    const sessionCart = store.carts.find((c: CartRecord) => c.sessionId === sessionId);
    if (sessionCart) return sessionCart;
  }
  return null;
}

export async function getOrCreateCartRecord(
  userId?: string | null,
  sessionId?: string | null
): Promise<CartRecord> {
  const store = getStore();
  let cart = findCart(store, userId, sessionId);

  if (!cart) {
    cart = {
      id: `cart-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      userId: userId || null,
      sessionId: sessionId || null,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.carts.push(cart);
    persistStore();
  } else {
    // If user is now logged in, associate cart with userId
    if (userId && !cart.userId) {
      cart.userId = userId;
      cart.updatedAt = new Date().toISOString();
      persistStore();
    }
  }

  return cart;
}

export async function getCartSummary(
  userId?: string | null,
  sessionId?: string | null,
  couponCode?: string | null
): Promise<CartSummary> {
  const store = getStore();
  const cart = findCart(store, userId, sessionId);

  if (!cart || cart.items.length === 0) {
    return {
      items: [],
      subtotal: 0,
      discount: 0,
      shippingFee: 0,
      total: 0,
      totalQuantity: 0,
      appliedCoupon: null,
    };
  }

  const items: CartSummary["items"] = [];
  let subtotal = 0;
  let totalQuantity = 0;

  for (const item of cart.items) {
    const product = store.products.find((p) => p.id === item.productId);
    if (!product) continue;

    // Check published status
    const isPub = product.status ? product.status === "PUBLISHED" : product.isActive;
    if (!isPub || product.status === "ARCHIVED") continue;

    const availableStock = product.availableStock !== undefined ? product.availableStock : (product.stock - (product.reservedQuantity || 0));
    const safeQuantity = Math.min(item.quantity, Math.max(1, availableStock));
    const itemTotal = product.price * safeQuantity;

    subtotal += itemTotal;
    totalQuantity += safeQuantity;

    items.push({
      id: item.id,
      product,
      quantity: safeQuantity,
      itemTotal,
    });
  }

  // Complimentary delivery threshold at ₹1000
  const shippingFee = subtotal >= 1000 || subtotal === 0 ? 0 : 99;

  // Coupon evaluation
  let discount = 0;
  let appliedCoupon: Coupon | null = null;

  if (couponCode) {
    const coupon = store.coupons.find(
      (c) => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.isActive
    );
    if (coupon && subtotal >= coupon.minOrderValue) {
      appliedCoupon = coupon;
      if (coupon.discountType === "percentage") {
        discount = Math.round((subtotal * coupon.discountValue) / 100);
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else {
        discount = coupon.discountValue;
      }
    }
  }

  const total = Math.max(0, subtotal - discount + shippingFee);

  return {
    items,
    subtotal,
    discount,
    shippingFee,
    total,
    totalQuantity,
    appliedCoupon,
  };
}

export async function addToCartStore(options: {
  userId?: string | null;
  sessionId?: string | null;
  productId: string;
  quantity: number;
}): Promise<{ success: boolean; message: string; cartSummary: CartSummary }> {
  const store = getStore();
  const { userId, sessionId, productId, quantity } = options;

  if (!quantity || quantity <= 0) {
    const summary = await getCartSummary(userId, sessionId);
    return { success: false, message: "Invalid quantity requested.", cartSummary: summary };
  }

  const product = store.products.find((p) => p.id === productId);
  if (!product) {
    const summary = await getCartSummary(userId, sessionId);
    return { success: false, message: "Formulation could not be found.", cartSummary: summary };
  }

  const isPub = product.status ? product.status === "PUBLISHED" : product.isActive;
  if (!isPub || product.status === "ARCHIVED") {
    const summary = await getCartSummary(userId, sessionId);
    return { success: false, message: "Formulation is currently not available for purchase.", cartSummary: summary };
  }

  const availableStock = product.availableStock !== undefined ? product.availableStock : (product.stock - (product.reservedQuantity || 0));
  if (availableStock <= 0) {
    const summary = await getCartSummary(userId, sessionId);
    return { success: false, message: "This formulation is currently Out of Stock.", cartSummary: summary };
  }

  const cart = await getOrCreateCartRecord(userId, sessionId);
  const existingItemIdx = cart.items.findIndex((i) => i.productId === productId);

  if (existingItemIdx > -1) {
    const currentQty = cart.items[existingItemIdx].quantity;
    const newQty = Math.min(availableStock, currentQty + quantity);
    if (currentQty >= availableStock) {
      const summary = await getCartSummary(userId, sessionId);
      return {
        success: false,
        message: `Maximum available inventory (${availableStock} units) already in your collection.`,
        cartSummary: summary,
      };
    }
    cart.items[existingItemIdx].quantity = newQty;
    cart.items[existingItemIdx].updatedAt = new Date().toISOString();
  } else {
    const safeQty = Math.min(availableStock, quantity);
    cart.items.push({
      id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      cartId: cart.id,
      productId,
      quantity: safeQty,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  cart.updatedAt = new Date().toISOString();
  persistStore();

  const summary = await getCartSummary(userId, sessionId);
  return {
    success: true,
    message: `Added ${product.name} to your collection.`,
    cartSummary: summary,
  };
}

export async function updateCartItemQuantityStore(options: {
  userId?: string | null;
  sessionId?: string | null;
  productId: string;
  quantity: number;
}): Promise<{ success: boolean; message?: string; cartSummary: CartSummary }> {
  const store = getStore();
  const { userId, sessionId, productId, quantity } = options;

  const cart = findCart(store, userId, sessionId);
  if (!cart) {
    const summary = await getCartSummary(userId, sessionId);
    return { success: false, message: "Cart not found.", cartSummary: summary };
  }

  const itemIdx = cart.items.findIndex((i) => i.productId === productId);
  if (itemIdx === -1) {
    const summary = await getCartSummary(userId, sessionId);
    return { success: false, message: "Item not present in cart.", cartSummary: summary };
  }

  if (quantity <= 0) {
    cart.items.splice(itemIdx, 1);
  } else {
    const product = store.products.find((p) => p.id === productId);
    const availableStock = product
      ? (product.availableStock !== undefined ? product.availableStock : (product.stock - (product.reservedQuantity || 0)))
      : 999;
    cart.items[itemIdx].quantity = Math.min(availableStock, quantity);
    cart.items[itemIdx].updatedAt = new Date().toISOString();
  }

  cart.updatedAt = new Date().toISOString();
  persistStore();

  const summary = await getCartSummary(userId, sessionId);
  return { success: true, cartSummary: summary };
}

export async function removeFromCartStore(options: {
  userId?: string | null;
  sessionId?: string | null;
  productId: string;
}): Promise<{ success: boolean; cartSummary: CartSummary }> {
  const store = getStore();
  const { userId, sessionId, productId } = options;

  const cart = findCart(store, userId, sessionId);
  if (cart) {
    cart.items = cart.items.filter((i) => i.productId !== productId);
    cart.updatedAt = new Date().toISOString();
    persistStore();
  }

  const summary = await getCartSummary(userId, sessionId);
  return { success: true, cartSummary: summary };
}

export async function clearCartStore(
  userId?: string | null,
  sessionId?: string | null
): Promise<boolean> {
  const store = getStore();
  const cart = findCart(store, userId, sessionId);
  if (cart) {
    cart.items = [];
    cart.updatedAt = new Date().toISOString();
    persistStore();
    return true;
  }
  return false;
}

export async function mergeCarts(guestSessionId: string, userId: string): Promise<CartSummary> {
  const store = getStore();
  const guestCart = store.carts.find((c) => c.sessionId === guestSessionId);
  const userCart = await getOrCreateCartRecord(userId, null);

  if (guestCart && guestCart.items.length > 0) {
    for (const guestItem of guestCart.items) {
      const product = store.products.find((p) => p.id === guestItem.productId);
      if (!product) continue;
      const availableStock = product.availableStock !== undefined ? product.availableStock : (product.stock - (product.reservedQuantity || 0));
      if (availableStock <= 0) continue;

      const userItemIdx = userCart.items.findIndex((i) => i.productId === guestItem.productId);
      if (userItemIdx > -1) {
        userCart.items[userItemIdx].quantity = Math.min(
          availableStock,
          userCart.items[userItemIdx].quantity + guestItem.quantity
        );
        userCart.items[userItemIdx].updatedAt = new Date().toISOString();
      } else {
        userCart.items.push({
          id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          cartId: userCart.id,
          productId: guestItem.productId,
          quantity: Math.min(availableStock, guestItem.quantity),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    // Empty guest cart items
    guestCart.items = [];
    guestCart.updatedAt = new Date().toISOString();
    userCart.updatedAt = new Date().toISOString();
    persistStore();
  }

  return getCartSummary(userId, null);
}

export async function getCheckoutSummary(
  userId?: string | null,
  sessionId?: string | null,
  couponCode?: string | null
): Promise<CartSummary> {
  return getCartSummary(userId, sessionId, couponCode);
}

// ==================== STAGE 4: WISHLIST SYSTEM ====================

function findWishlist(store: any, userId?: string | null, sessionId?: string | null): WishlistRecord | null {
  if (userId) {
    const userW = store.wishlists.find((w: WishlistRecord) => w.userId === userId);
    if (userW) return userW;
  }
  if (sessionId) {
    const sessionW = store.wishlists.find((w: WishlistRecord) => w.sessionId === sessionId);
    if (sessionW) return sessionW;
  }
  return null;
}

export async function getWishlistProducts(
  userId?: string | null,
  sessionId?: string | null
): Promise<Product[]> {
  const store = getStore();
  const wishlist = findWishlist(store, userId, sessionId);
  if (!wishlist || wishlist.productIds.length === 0) return [];

  const products: Product[] = [];
  for (const id of wishlist.productIds) {
    const p = store.products.find((prod) => prod.id === id);
    if (p) products.push(p);
  }
  return products;
}

export async function addToWishlistStore(
  userId: string | null | undefined,
  sessionId: string | null | undefined,
  productId: string
): Promise<Product[]> {
  const store = getStore();
  let wishlist = findWishlist(store, userId, sessionId);

  if (!wishlist) {
    wishlist = {
      id: `wish-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: userId || null,
      sessionId: sessionId || null,
      productIds: [productId],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.wishlists.push(wishlist);
  } else {
    if (!wishlist.productIds.includes(productId)) {
      wishlist.productIds.push(productId);
      wishlist.updatedAt = new Date().toISOString();
    }
    if (userId && !wishlist.userId) {
      wishlist.userId = userId;
    }
  }

  persistStore();
  return getWishlistProducts(userId, sessionId);
}

export async function removeFromWishlistStore(
  userId: string | null | undefined,
  sessionId: string | null | undefined,
  productId: string
): Promise<Product[]> {
  const store = getStore();
  const wishlist = findWishlist(store, userId, sessionId);
  if (wishlist) {
    wishlist.productIds = wishlist.productIds.filter((id) => id !== productId);
    wishlist.updatedAt = new Date().toISOString();
    persistStore();
  }
  return getWishlistProducts(userId, sessionId);
}

export async function mergeWishlists(guestSessionId: string, userId: string): Promise<Product[]> {
  const store = getStore();
  const guestW = store.wishlists.find((w) => w.sessionId === guestSessionId);
  let userW = store.wishlists.find((w) => w.userId === userId);

  if (!userW) {
    userW = {
      id: `wish-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      sessionId: null,
      productIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.wishlists.push(userW);
  }

  if (guestW && guestW.productIds.length > 0) {
    for (const pid of guestW.productIds) {
      if (!userW.productIds.includes(pid)) {
        userW.productIds.push(pid);
      }
    }
    guestW.productIds = [];
    guestW.updatedAt = new Date().toISOString();
    userW.updatedAt = new Date().toISOString();
    persistStore();
  }

  return getWishlistProducts(userId, null);
}

// ==================== STAGE 4: PASSWORD RESET TOKENS ====================

export async function createPasswordResetToken(email: string): Promise<PasswordResetToken> {
  const store = getStore();
  const normalizedEmail = email.trim().toLowerCase();

  // Invalidate any active previous tokens for this email
  store.resetTokens = store.resetTokens.filter((t) => t.email.toLowerCase() !== normalizedEmail);

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour validity

  const resetRecord: PasswordResetToken = {
    id: `tok-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    email: normalizedEmail,
    token,
    expiresAt,
    usedAt: null,
    createdAt: new Date().toISOString(),
  };

  store.resetTokens.push(resetRecord);
  persistStore();
  return resetRecord;
}

export async function verifyPasswordResetToken(
  token: string
): Promise<{ valid: boolean; email?: string }> {
  const store = getStore();
  const record = store.resetTokens.find((t) => t.token === token);
  if (!record) return { valid: false };

  if (record.usedAt) return { valid: false };

  if (new Date(record.expiresAt).getTime() < Date.now()) {
    return { valid: false };
  }

  return { valid: true, email: record.email };
}

export async function consumePasswordResetToken(token: string): Promise<boolean> {
  const store = getStore();
  const record = store.resetTokens.find((t) => t.token === token);
  if (!record || record.usedAt) return false;

  record.usedAt = new Date().toISOString();
  persistStore();
  return true;
}

