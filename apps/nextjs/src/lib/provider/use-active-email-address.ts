import { useParams } from "next/navigation";

import { useEmailAddressById } from "@skylar/client-db";

export const useActiveEmailAddress = () => {
  const { providerIndex } = useParams();
  let emailIdNumber =
    parseInt(typeof providerIndex === "string" ? providerIndex : "1", 10) ?? 1;
  if (emailIdNumber < 1) {
    emailIdNumber = 1;
  }
  return useEmailAddressById(emailIdNumber);
};
