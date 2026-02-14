import React, { createContext, useState, useEffect } from "react";
import type { ProductType } from "../types/Product";
import { getProducts } from "../services/ProductService";

interface ProductContextType {
  products: ProductType[];
  setProducts: React.Dispatch<React.SetStateAction<ProductType[]>>;
}

export const ProductContext = createContext<ProductContextType>({
  products: [],
  setProducts: () => {},
});

const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts();
        setProducts(products);
      } catch (error) {
        console.log("Error while fetching products from ProductContext", error);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
