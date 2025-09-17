// API Response Types
export interface ApiResponse {
  message: string;
  timestamp: string;
  status: "success" | "error";
  data?: any;
}

// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  createdAt: Date;
  stripeCustomerId?: string;
}

export interface CreateUserInput {
  email: string;
  password: string;
  name?: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, "createdAt"> & { createdAt?: Date };
  token: string;
}

// Address Types
export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface CreateAddressInput {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  isActive: boolean;
  sortOrder: number;
  children?: Category[];
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  image?: string;
  parentId?: string;
  isActive?: boolean;
  sortOrder?: number;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDesc?: string;
  price: number;
  comparePrice?: number;
  sku?: string;
  barcode?: string;
  weight?: number;
  status: ProductStatus;
  isDigital: boolean;
  isFeatured: boolean;
  tags: string[];
  images: string[];
  category?: Category;
  variants?: ProductVariant[];
  reviews?: Review[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku?: string;
  price?: number;
  inventory: number;
  isActive: boolean;
  options: Record<string, string>;
  image?: string;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  shortDesc?: string;
  price: number;
  comparePrice?: number;
  sku?: string;
  categoryId?: string;
  tags?: string[];
  images?: string[];
  isDigital?: boolean;
  isFeatured?: boolean;
  variants?: Omit<ProductVariant, "id" | "productId">[];
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}

// Cart Types
export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  variantId?: string;
  quantity: number;
  product: Product;
  variant?: ProductVariant;
  createdAt: Date;
  updatedAt: Date;
}

export interface AddToCartInput {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface UpdateCartItemInput {
  quantity: number;
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  items: OrderItem[];
  shippingAddress?: Address;
  billingAddress?: Address;
  createdAt: Date;
  updatedAt: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  total: number;
  product: Product;
  variant?: ProductVariant;
}

export interface CreateOrderInput {
  shippingAddressId?: string;
  billingAddressId?: string;
  paymentMethodId?: string;
}

// Review Types
export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title?: string;
  comment?: string;
  isVerified: boolean;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReviewInput {
  productId: string;
  rating: number;
  title?: string;
  comment?: string;
}

// Subscription Types
export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  CANCELED = "CANCELED",
  PAST_DUE = "PAST_DUE",
  INCOMPLETE = "INCOMPLETE",
  TRIALING = "TRIALING",
}

export interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId: string;
  stripePriceId: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Stripe Types
export interface CreateCheckoutSessionInput {
  priceId: string;
}

export interface CheckoutSessionResponse {
  sessionId: string;
}

// Enums
export enum UserRole {
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
}

export enum ProductStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
}

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED",
}

export enum FulfillmentStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

// Error Types
export interface ErrorResponse {
  error: string;
  code?: string;
  details?: any;
}

// Common Types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
