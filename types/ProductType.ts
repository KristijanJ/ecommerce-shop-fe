export interface ProductType {
  id: number;
  title: string;
  price: number;
  description: string;
  category: ProductCategoryType;
  image: string;
  ratingRate: number;
  ratingCount: number;
}

export interface ProductCategoryType {
  id: number;
  name: string;
}
