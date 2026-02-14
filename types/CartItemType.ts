import type { ProductType } from "./ProductType";

export interface CartItemType extends ProductType {
  amount: number;
}
