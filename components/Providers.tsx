"use client";

import CartProvider from "@/contexts/CartContext";
import SidebarProvider from "@/contexts/SidebarContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <CartProvider>{children}</CartProvider>
    </SidebarProvider>
  );
}
