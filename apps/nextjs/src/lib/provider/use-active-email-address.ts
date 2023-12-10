import { useParams, useRouter } from "next/navigation";

import { useEmailAddressById } from "@skylar/client-db";

export const useActiveEmailAddress = () => {
  const { providerIndex } = useParams();
  const router = useRouter();
  const emailIdNumber =
    parseInt(typeof providerIndex === "string" ? providerIndex : "1", 10) ?? 1;
  if (emailIdNumber < 1) {
    router.push("/1");
  }
  return useEmailAddressById(emailIdNumber);
};
