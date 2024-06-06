import { LinkedAccounts } from "@/types/user";

type SocialAccount = {
  name: string;
  value: string;
};

export const getFormatedSocialLinks = (linkedAccounts: LinkedAccounts) => {
  const socialAccounts: SocialAccount[] = [];

  Object.entries(linkedAccounts).forEach(([key, value]) => {
    if (value) {
      socialAccounts.push({
        name: key[0].toUpperCase() + key.slice(1),
        value,
      });
    }
  });

  return socialAccounts;
};
