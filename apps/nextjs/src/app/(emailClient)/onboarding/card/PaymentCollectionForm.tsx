"use client";

import { PaymentElement } from "@stripe/react-stripe-js";

import { Button } from "~/components/ui/button";
import { useCardPage } from "./useCardPage";

export const PaymentCollectionForm = () => {
  const {
    onPaymentElementLoad,
    handlePaymentElementSubmit,
    canSubmitPaymentDetail,
    isSubmittingPaymentDetails,
  } = useCardPage();

  return (
    <form
      className="flex min-h-[413px] flex-col space-y-5"
      onSubmit={handlePaymentElementSubmit}
    >
      <div className="grow">
        <PaymentElement onReady={onPaymentElementLoad} />
      </div>
      <Button
        disabled={!canSubmitPaymentDetail}
        isLoading={isSubmittingPaymentDetails}
      >
        Submit
      </Button>
    </form>
  );
};
