"use client";

import React, { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ProductType } from "@/types/ProductType";
import type { CartItemType } from "@/types/CartItemType";
import { getCart, updateCart } from "@/app/actions/cart";

interface CartContextType {
  cart: CartItemType[];
  addToCart: (product: ProductType, id: number) => void;
  removeFromCart: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
  increaseAmount: (id: number) => Promise<void>;
  decreaseAmount: (id: number) => Promise<void>;
  itemAmount: number;
  total: number;
}

export const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: async () => {},
  removeFromCart: async () => {},
  clearCart: async () => {},
  increaseAmount: async () => {},
  decreaseAmount: async () => {},
  itemAmount: 0,
  total: 0,
});

const CartProvider = ({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: number | null;
}) => {
  const router = useRouter();
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [itemAmount, setItemAmount] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    if (!userId) {
      setCart([]);
      return;
    }

    const fetchCart = async () => {
      try {
        const cartData = await getCart();
        setCart(cartData);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, [userId]);

  useEffect(() => {
    const total = cart.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.price * currentItem.amount;
    }, 0);
    setTotal(total);
  }, [cart]);

  useEffect(() => {
    if (cart) {
      const amount = cart.reduce((accumulator, currentItem) => {
        return accumulator + currentItem.amount;
      }, 0);
      setItemAmount(amount);
    }
  }, [cart]);

  const addToCart = async (product: ProductType, id: number) => {
    if (!userId) {
      router.push("/login");
      return;
    }

    const newItem: CartItemType = { ...product, amount: 1 };
    // check if the item is already in the cart
    const cartItem = cart.find((item) => {
      return item.id === id;
    });
    if (cartItem) {
      const newCart = [...cart].map((item) => {
        if (item.id === id) {
          return { ...item, amount: cartItem.amount + 1 };
        } else return item;
      });
      setCart(newCart);
      await updateCart(newCart);
    } else {
      const newCart = [...cart, newItem];
      setCart(newCart);
      await updateCart(newCart);
    }
  };

  const removeFromCart = async (id: number) => {
    const newCart = cart.filter((item) => {
      return item.id !== id;
    });
    setCart(newCart);
    await updateCart(newCart);
  };

  const clearCart = async () => {
    setCart([]);
    await updateCart([]);
  };

  const increaseAmount = async (id: number) => {
    const cartItem = cart.find((item) => item.id === id);
    if (cartItem) {
      await addToCart(cartItem, id);
    }
  };

  const decreaseAmount = async (id: number) => {
    const cartItem = cart.find((item) => item.id === id);
    if (cartItem) {
      if (cartItem.amount < 2) {
        await removeFromCart(id);
        return;
      }

      const newCart = cart.map((item) => {
        if (item.id === id) {
          return { ...item, amount: cartItem.amount - 1 };
        } else {
          return item;
        }
      });
      setCart(newCart);
      await updateCart(newCart);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        increaseAmount,
        decreaseAmount,
        itemAmount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
