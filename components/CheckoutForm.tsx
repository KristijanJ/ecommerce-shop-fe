"use client";

import { useActionState, useContext } from "react";
import { CartContext } from "@/contexts/CartContext";
import Link from "next/link";
import { UserType } from "@/types/UserType";
import { checkoutFormAction } from "@/app/actions/checkout";

interface CheckoutFormProps {
  user: UserType;
}

export default function CheckoutForm({ user }: CheckoutFormProps) {
  const { cart, total } = useContext(CartContext);
  const [state, action, pending] = useActionState(checkoutFormAction, {
    error: "",
    fields: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  });

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <p className="text-gray-500 text-lg">Your cart is empty.</p>
        <Link href="/" className="bg-primary text-white px-6 py-2 font-medium">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <form action={action}>
      <input
        type="hidden"
        name="cart"
        value={JSON.stringify({
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.amount,
          })),
        })}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Order Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Order Summary
          </h2>
          <div className="flex flex-col divide-y">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-4 py-4">
                <div className="w-20 h-20 shrink-0 bg-gray-50">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <div className="flex flex-1 justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm line-clamp-2">
                      {item.title}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {item.category.name}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Qty: {item.amount}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Available stock: {item.stock}
                    </p>
                    {item.amount > item.stock && (
                      <p className="text-red-500 text-sm mt-1">
                        Not enough stock available
                      </p>
                    )}
                  </div>
                  <p className="font-semibold text-sm whitespace-nowrap">
                    ${(item.price * item.amount).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4 pt-4 border-t font-bold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Shipping Details */}
        <div>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Shipping Details
          </h2>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">First Name</label>
                <input
                  name="firstName"
                  type="text"
                  required
                  placeholder="John"
                  defaultValue={state?.fields?.firstName}
                  className="border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Last Name</label>
                <input
                  name="lastName"
                  type="text"
                  required
                  placeholder="Doe"
                  defaultValue={state?.fields?.lastName}
                  className="border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Email</label>
              <input
                name="email"
                type="email"
                required
                placeholder="john@example.com"
                defaultValue={state?.fields?.email}
                className="border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Address</label>
              <input
                name="address"
                type="text"
                required
                placeholder="123 Main St"
                defaultValue={state?.fields?.address}
                className="border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">City</label>
                <input
                  name="city"
                  type="text"
                  required
                  placeholder="New York"
                  defaultValue={state?.fields?.city}
                  className="border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">ZIP Code</label>
                <input
                  name="zip"
                  type="text"
                  required
                  placeholder="10001"
                  defaultValue={state?.fields?.zip}
                  className="border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Country</label>
              <input
                name="country"
                type="text"
                required
                placeholder="United States"
                defaultValue={state?.fields?.country}
                className="border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="bg-primary text-white w-full py-3 mt-6 font-medium hover:opacity-90 transition-opacity"
          >
            {pending ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>
    </form>
  );
}
