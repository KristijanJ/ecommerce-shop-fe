import { getSession } from "@/app/lib/session";
import { getPurchases } from "@/app/lib/purchases";
import Link from "next/link";

async function AccountPage() {
  const [user, purchases] = await Promise.all([getSession(), getPurchases()]);

  const totalOrders = purchases.length;
  const pendingOrders = purchases.filter(
    (p: any) => p.status === "PENDING",
  ).length;
  const completedOrders = purchases.filter(
    (p: any) => p.status !== "PENDING",
  ).length;

  return (
    <div className="flex flex-col gap-6">
      {/* User info */}
      <div className="border rounded-lg p-6">
        <p className="text-sm text-gray-500 mb-1">Signed in as</p>
        <p className="font-semibold text-lg">
          {user?.firstName} {user?.lastName}
        </p>
        <p className="text-sm text-gray-500">{user?.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{totalOrders}</p>
          <p className="text-sm text-gray-500 mt-1">Total Orders</p>
        </div>
        <div className="border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{completedOrders}</p>
          <p className="text-sm text-gray-500 mt-1">Completed</p>
        </div>
        <div className="border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
          <p className="text-sm text-gray-500 mt-1">Pending</p>
        </div>
      </div>

      {/* Quick links */}
      <div className="border rounded-lg divide-y">
        <Link
          href="/account/purchases"
          className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
        >
          <span className="text-sm font-medium">My Purchases</span>
          <span className="text-gray-400">›</span>
        </Link>
        <Link
          href="/account/settings"
          className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
        >
          <span className="text-sm font-medium">Settings</span>
          <span className="text-gray-400">›</span>
        </Link>
      </div>
    </div>
  );
}

export default AccountPage;
