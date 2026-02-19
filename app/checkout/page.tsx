import CheckoutForm from "@/components/CheckoutForm";
import { getSession } from "../lib/session";
import { redirect } from "next/navigation";

async function Checkout() {
  const user = await getSession();

  if (!user) {
    redirect("/login");
  }

  return (
    <section className="pt-32 pb-100 md:pb-12 lg:py-32 flex">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Checkout</h1>
        <CheckoutForm user={user} />
      </div>
    </section>
  );
}

export default Checkout;
