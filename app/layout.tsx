import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { getSession } from "@/app/lib/session";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "E-Commerce Shop",
  description: "Fresh Fashion Finds - Your favorite online store",
};

const shopName = process.env.SHOP_NAME || "My Shop";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSession();

  return (
    <html lang="en">
      <body className={`${poppins.variable} min-h-screen flex flex-col justify-between`}>
        <Providers>
          <Header user={user} shopName={shopName} />
          {children}
          <Sidebar />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
