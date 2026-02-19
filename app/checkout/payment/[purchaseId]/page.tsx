import { getSession } from "@/app/lib/session";
import { getPurchase } from "@/app/lib/purchases";
import PaymentForm from "@/components/PaymentForm";
import { redirect, notFound } from "next/navigation";

interface PaymentPageProps {
  params: Promise<{ purchaseId: string }>;
}

async function PaymentPage({ params }: PaymentPageProps) {
  const { purchaseId } = await params;
  const user = await getSession();

  if (!user) {
    redirect("/login");
  }

  const purchaseIdNum = parseInt(purchaseId, 10);

  if (isNaN(purchaseIdNum)) {
    notFound();
  }

  const purchase = await getPurchase(purchaseIdNum);

  if (!purchase) {
    notFound();
  }

  if (purchase.status !== "PENDING") {
    redirect(`/order-confirmation/${purchaseIdNum}`);
  }

  const cardholderName = `${user.firstName} ${user.lastName}`;

  return (
    <section className="pt-32 pb-12 lg:py-32 flex min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center">Payment</h1>
        <p className="text-center text-gray-400 mb-10 text-sm">
          Order #{purchaseIdNum}
        </p>
        <PaymentForm
          purchaseId={purchaseIdNum}
          cardholderName={cardholderName}
        />
      </div>
    </section>
  );
}

export default PaymentPage;
