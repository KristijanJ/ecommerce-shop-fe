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
