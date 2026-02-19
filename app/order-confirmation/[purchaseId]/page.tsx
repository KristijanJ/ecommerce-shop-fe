import Link from "next/link";
import { getSession } from "@/app/lib/session";
import { redirect } from "next/navigation";

interface OrderConfirmationPageProps {
  params: Promise<{ purchaseId: string }>;
}

async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { purchaseId } = await params;
  const user = await getSession();

  if (!user) {
    redirect("/login");
  }

  return (
    <section className="pt-32 pb-12 lg:py-32 flex min-h-screen">
      <div className="container mx-auto flex flex-col items-center text-center gap-6">
        {/* Checkmark */}
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold">Order Confirmed!</h1>
          <p className="text-gray-500">
            Thank you, {user.firstName}. Your payment was successful.
          </p>
        </div>

        <div className="bg-gray-50 border rounded-lg px-8 py-4 flex flex-col gap-1">
          <span className="text-sm text-gray-400">Order reference</span>
          <span className="text-xl font-mono font-semibold">
            #{purchaseId}
          </span>
        </div>

        <p className="text-sm text-gray-400 max-w-sm">
          Your order has been placed and is now being processed. You will
          receive a confirmation shortly.
        </p>

        <Link
          href="/"
          className="bg-primary text-white px-8 py-3 font-medium hover:opacity-90 transition-opacity"
        >
          Continue Shopping
        </Link>
      </div>
    </section>
  );
}

export default OrderConfirmationPage;
