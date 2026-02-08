import type { ProductType } from "./Product";

export interface CartItemType extends ProductType {
  amount: number;
}
