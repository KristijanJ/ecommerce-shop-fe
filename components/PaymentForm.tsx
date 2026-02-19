"use client";

import { useActionState } from "react";
import { paymentAction } from "@/app/actions/checkout";

interface PaymentFormProps {
  purchaseId: number;
  cardholderName: string;
}

export default function PaymentForm({
  purchaseId,
  cardholderName,
}: PaymentFormProps) {
  const [state, action, pending] = useActionState(paymentAction, undefined);

  return (
    <form action={action} className="flex flex-col items-center gap-8">
      <input type="hidden" name="purchaseId" value={purchaseId} />

      {/* Card visual */}
      <div className="w-96 h-56 rounded-2xl bg-linear-to-br from-gray-800 to-gray-600 text-white p-6 shadow-2xl flex flex-col justify-between select-none">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-300 uppercase tracking-widest">
              Demo Card
            </span>
          </div>
          <div className="text-2xl font-bold tracking-widest text-gray-300">
            VISA
          </div>
        </div>

        <div className="text-xl tracking-widest font-mono">
          4242 4242 4242 4242
        </div>

        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-gray-400 uppercase">Card Holder</span>
            <span className="text-sm font-medium uppercase tracking-wide">
              {cardholderName}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 text-right">
            <span className="text-xs text-gray-400 uppercase">Expires</span>
            <span className="text-sm font-mono">12/28</span>
          </div>
        </div>
      </div>

      {/* Form fields (pre-filled, for show) */}
      <div className="w-full max-w-sm flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">
            Card Number
          </label>
          <input
            type="text"
            readOnly
            value="4242 4242 4242 4242"
            className="border px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">
            Cardholder Name
          </label>
          <input
            type="text"
            readOnly
            value={cardholderName.toUpperCase()}
            className="border px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">
              Expiry Date
            </label>
            <input
              type="text"
              readOnly
              value="12/28"
              className="border px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">CVV</label>
            <input
              type="text"
              readOnly
              value="123"
              className="border px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed focus:outline-none"
            />
          </div>
        </div>

        {state?.error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
            {state.error}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="bg-primary text-white w-full py-3 font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {pending ? "Processing payment..." : "Pay Now"}
        </button>

        <p className="text-center text-xs text-gray-400">
          This is a demo payment. No real charge will be made.
        </p>
      </div>
    </form>
  );
}
