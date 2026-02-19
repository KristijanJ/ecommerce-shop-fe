import { getSession } from "@/app/lib/session";
import { getPurchases } from "@/app/lib/purchases";
import { redirect } from "next/navigation";
import Link from "next/link";

async function PurchasesPage() {
  const user = await getSession();

  if (!user) {
    redirect("/login");
  }

  const purchases = await getPurchases();

  return (
    <section className="pt-32 pb-12 lg:py-32 min-h-screen">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">My Purchases</h1>

        {purchases.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-gray-500">You have no purchases yet.</p>
            <Link
              href="/"
              className="bg-primary text-white px-6 py-2 font-medium hover:opacity-90 transition-opacity"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {purchases.map((purchase: any) => {
              const isPending = purchase.status === "PENDING";
              const total = (purchase.amount / 100).toFixed(2);
              const allItems = purchase.orders.flatMap(
                (order: any) => order.orderItems,
              );

              return (
                <div
                  key={purchase.id}
                  className="border rounded-lg p-6 flex flex-col gap-4"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-700">
                        Order #{purchase.id}
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          isPending
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {purchase.status}
                      </span>
                    </div>
                    <span className="font-bold text-lg">${total}</span>
                  </div>

                  {/* Items */}
                  <div className="flex flex-col divide-y">
                    {allItems.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 py-3"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="w-12 h-12 object-contain bg-gray-50 p-1"
                        />
                        <div className="flex flex-1 justify-between gap-2">
                          <p className="text-sm font-medium line-clamp-1">
                            {item.product.title}
                          </p>
                          <div className="text-sm text-gray-500 whitespace-nowrap text-right">
                            <span>Qty: {item.quantity}</span>
                            <span className="ml-3 font-medium text-gray-700">
                              ${(item.priceAtPurchase / 100).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Payment info / action */}
                  {isPending ? (
                    <Link
                      href={`/checkout/payment/${purchase.id}`}
                      className="bg-primary text-white text-center py-2 px-4 font-medium hover:opacity-90 transition-opacity text-sm"
                    >
                      Complete Payment
                    </Link>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <svg
                        className="w-4 h-4"
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
                      <span>
                        Paid — ${(purchase.payments[0]?.amount / 100).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default PurchasesPage;
