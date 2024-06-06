import { ReduxUser } from "@/types/user";
import { createSlice } from "@reduxjs/toolkit";

type InitialUser = ReduxUser | null;

const userSlice = createSlice({
  name: "user",
  initialState: null as InitialUser,
  reducers: {
    setReduxUser(state, action: { payload: ReduxUser | null }) {
      return action.payload ? { ...action.payload } : null;
    },
    updateReduxUser(state, action: { payload: Partial<ReduxUser> }) {
      if (state) return { ...state, ...action?.payload };
    },
  },
});

export const { setReduxUser, updateReduxUser } = userSlice.actions;
export default userSlice.reducer;
