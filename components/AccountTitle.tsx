"use client";

import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/account": "My Account",
  "/account/purchases": "My Purchases",
  "/account/settings": "Settings",
};

export default function AccountTitle() {
  const pathname = usePathname();
  const title = titles[pathname] ?? "My Account";
  return <h1 className="text-3xl font-bold mb-8">{title}</h1>;
}
