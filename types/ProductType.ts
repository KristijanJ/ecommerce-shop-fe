export interface ProductOwnerType {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
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
  owner: ProductOwnerType;
}

export interface ProductCategoryType {
  id: number;
  name: string;
}
