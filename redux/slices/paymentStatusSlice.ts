import { createSlice } from "@reduxjs/toolkit";

export type PaymentMethodStatus = {
  paymentStatus: string | null;
};
const paymentMethodStatus: PaymentMethodStatus = {
  paymentStatus: "",
};

const paymentSlice = createSlice({
  name: "payments",
  initialState: paymentMethodStatus,
  reducers: {
    setPaymentStatus(state, action) {
      let value: PaymentMethodStatus = {
        paymentStatus: "",
      };
      if (action.payload === "true") {
        value.paymentStatus = "true";
      } else if (action.payload === "false") {
        value.paymentStatus = "false";
      } else {
        value.paymentStatus = null;
      }

      return value;
    },
  },
});

export const { setPaymentStatus } = paymentSlice.actions;
export default paymentSlice.reducer;
