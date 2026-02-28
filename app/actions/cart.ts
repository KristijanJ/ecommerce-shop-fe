"use server";

import { CartItemType } from "@/types/CartItemType";
import redis from "../lib/redis";
import { getSession } from "../lib/session";
import logger from "../lib/logger";

export const updateCart = async (newCart: CartItemType[]) => {
  const user = await getSession();

  if (!user) {
    throw new Error("User not authenticated");
  }

  await redis.set(`cart:${user.id}`, JSON.stringify(newCart));
  logger.info({ userId: user.id, itemCount: newCart.length }, "Cart updated");
};

export const getCart = async (): Promise<CartItemType[]> => {
  const user = await getSession();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const cartData = await redis.get(`cart:${user.id}`);
  const cart: CartItemType[] = cartData ? JSON.parse(cartData) : [];
  logger.info({ userId: user.id, itemCount: cart.length }, "Cart fetched");
  return cart;
};
