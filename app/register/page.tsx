"use client";

import { useActionState, useState } from "react";
import { registerAction } from "@/app/actions/auth";
import Link from "next/link";

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerAction, undefined);
  const [role, setRole] = useState<"buyer" | "seller">(
    (state?.fields?.role as "buyer" | "seller") ?? "buyer",
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" action={action}>
          {state?.error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
              {state.error}
            </div>
          )}

          {/* Role selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I want to...
            </label>
            <input type="hidden" name="role" value={role} />
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("buyer")}
                className={`border-2 rounded-lg p-4 text-left transition-colors cursor-pointer ${
                  role === "buyer"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-xl mb-1">🛍️</div>
                <div className="font-semibold text-sm">Shop</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  Browse and buy products
                </div>
              </button>
              <button
                type="button"
                onClick={() => setRole("seller")}
                className={`border-2 rounded-lg p-4 text-left transition-colors cursor-pointer ${
                  role === "seller"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-xl mb-1">🏪</div>
                <div className="font-semibold text-sm">Sell</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  List and sell products
                </div>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  defaultValue={state?.fields?.firstName}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  defaultValue={state?.fields?.lastName}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                defaultValue={state?.fields?.email}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="confirmEmail"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Email
              </label>
              <input
                id="confirmEmail"
                name="confirmEmail"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 8 characters
              </p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={pending}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pending ? "Creating account..." : "Create account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}