export type Session = {
  sessionUrl: string;
  sessionId: string ;
};

export enum BankAccountStatus {
  "ACCOUNT_NOT_LINKED",
  "ACCOUNT_LINKED",
  "ACCOUNT_VERIFICATION_PENDING",
  "ACCOUNT_DETAILS_PENDING",
}
