"use client";

import { PaymentElement } from "@stripe/react-stripe-js";

import { Button } from "~/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { useCardPage } from "./use-card-page";

export const PaymentCollectionForm = () => {
  const {
    onPaymentElementLoad,
    handlePaymentElementSubmit,
    canSubmitPaymentDetail,
    isSubmittingPaymentDetails,
  } = useCardPage();

  return (
    <div className="flex flex-col space-y-6 pt-5">
      <CardHeader className="p-0">
        <CardTitle>Card Details</CardTitle>
        <CardDescription>
          To prevent spam and enable seamless upgrades, we require a card on
          file. We will not charge you before explicitly asking for your
          consent.
        </CardDescription>
      </CardHeader>
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
    </div>
  );
};
