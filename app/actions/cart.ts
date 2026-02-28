"use server";

import { CartItemType } from "@/types/CartItemType";
import redis from "../lib/redis";
import { getSession } from "../lib/session";

export const updateCart = async (newCart: CartItemType[]) => {
  const user = await getSession();

  if (!user) {
    throw new Error("User not authenticated");
  }

  await redis.set(`cart:${user.id}`, JSON.stringify(newCart));
};

export const getCart = async (): Promise<CartItemType[]> => {
  const user = await getSession();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const cartData = await redis.get(`cart:${user.id}`);
  return cartData ? JSON.parse(cartData) : [];
};
