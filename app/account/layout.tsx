import { redirect } from "next/navigation";
import { getSession } from "../lib/session";
import Link from "next/link";
import AccountTitle from "@/components/AccountTitle";

const navLinks = [
  { href: "/account", label: "Overview" },
  { href: "/account/purchases", label: "My Purchases" },
  { href: "/account/settings", label: "Settings" },
];

export default async function AccountLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  return (
    <section className="pt-32 pb-12 lg:py-32 min-h-screen">
      <div className="container mx-auto">
        <AccountTitle />

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Nav — horizontal scroll on mobile, vertical sidebar on lg+ */}
          <nav className="w-full lg:w-56 lg:shrink-0 lg:sticky lg:top-32 border rounded-lg overflow-hidden">
            <ul className="flex lg:flex-col overflow-x-auto">
              {navLinks.map(({ href, label }) => (
                <li key={href} className="shrink-0">
                  <Link
                    href={href}
                    className="block px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors border-r lg:border-r-0 lg:border-b last:border-0"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content area */}
          <div className="flex-1 w-full rounded-lg px-6 min-h-64">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
