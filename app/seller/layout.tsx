import { redirect } from "next/navigation";
import { getSession } from "../lib/session";

export default async function SellerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getSession();

  if (
    !user ||
    !(user.roles.includes("seller") || user.roles.includes("admin"))
  ) {
    redirect("/");
  }

  return <>{children}</>;
}
