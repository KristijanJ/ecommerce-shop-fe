"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { SidebarContext } from "@/contexts/SidebarContext";
import { CartContext } from "@/contexts/CartContext";
import { logoutAction } from "@/app/actions/auth";
import { UserType } from "@/types/UserType";
import Link from "next/link";
import { BsBag, BsPerson, BsBoxArrowRight } from "react-icons/bs";

const Header = ({ user }: { user: UserType | null }) => {
  const { isOpen, setIsOpen } = useContext(SidebarContext);
  const { itemAmount } = useContext(CartContext);

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="bg-white py-4 shadow-md fixed w-full z-10 lg:px-8">
      <div className="container mx-auto flex items-center justify-between h-full">
        <Link href={"/"}>
          <div className="w-10">
            <img src="/logo.svg" alt="" />
          </div>
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <div ref={ref} className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <BsPerson className="text-2xl" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg border border-gray-100">
                    <div className="text-sm font-medium border-b border-gray-200 p-2 flex items-center gap-2">
                      <BsPerson className="text-lg" />
                      <span>
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                    {(user.roles.includes("seller") ||
                      user.roles.includes("admin")) && (
                      <div className="text-sm font-medium p-2 flex items-center gap-2">
                        <BsBag className="text-lg" />
                        <Link
                          href="/seller/my-products"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          My products
                        </Link>
                      </div>
                    )}
                    <form action={logoutAction} className="gap-2 flex flex-col">
                      <button
                        type="submit"
                        className="flex items-center gap-2 text-sm hover:text-red-500 transition-colors cursor-pointer p-2"
                        title="Logout"
                      >
                        <BsBoxArrowRight className="text-lg" />
                        <span>Logout</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium hover:text-gray-500 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium bg-primary text-white px-4 py-2 rounded"
              >
                Sign Up
              </Link>
            </div>
          )}

          {user && (
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer flex relative"
            >
              <BsBag className="text-2xl" />
              <div className="bg-red-500 absolute -right-2 -bottom-2 text-[12px] w-4.5 h-4.5 text-white rounded-full flex justify-center items-center">
                {itemAmount}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
