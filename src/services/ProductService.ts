import type { ProductType } from "../types/Product";

export const getProducts = async (): Promise<ProductType[]> => {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
