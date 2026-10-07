import { UserType } from "./UserType";

export enum PurchaseStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export interface ProductOwnerType {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface OrderItem {
  id: number;
  priceAtPurchase: number;
  quantity: number;
  product: ProductType;
}

export interface ProductType {
  id: number;
  title: string;
  price: number;
  description: string;
  category: ProductCategoryType;
  image: string;
  ratingRate: number;
  ratingCount: number;
  stock: number;
  owner: ProductOwnerType;
  orderItems?: OrderItem[];
}

export interface ProductCategoryType {
  id: number;
  name: string;
}

export interface PaymentType {
  id: number;
  status: PurchaseStatus;
  amount: number;
  purchase: PurchaseType;
  purchaseId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseType {
  id: number;
  buyer: UserType;
  buyerId: number;
  amount: number;
  status: PurchaseStatus;
  orders: OrderType[];
  payments: PaymentType[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderType {
  id: number;
  buyer: UserType;
  buyerId: number;
  seller: UserType;
  sellerId: number;
  purchase: PurchaseType;
  purchaseId: number;
  orderItems: OrderItem[];
  status: PurchaseStatus;
  createdAt: Date;
  updatedAt: Date;
}
