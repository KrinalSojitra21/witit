export type SendNotification = {
  type: "SUCCESS" | "ERROR" | "LOADING" | "REMOVE";
  message?: string;
};

export type Category = {
  startIcon: JSX.Element;
  name: string;
};
