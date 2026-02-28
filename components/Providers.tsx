"use client";

import CartProvider from "@/contexts/CartContext";
import SidebarProvider from "@/contexts/SidebarContext";

export function Providers({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: number | null;
}) {
  return (
    <SidebarProvider>
      <CartProvider userId={userId}>{children}</CartProvider>
    </SidebarProvider>
  );
}
