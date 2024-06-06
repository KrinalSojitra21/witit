import { BaseModel, FriendModel, ModelContainer, UserModel } from "@/types/ai";
import { createSlice } from "@reduxjs/toolkit";

const initialModelContainer: ModelContainer = {
  baseModelList: [],
  userModelList: [],
  friendModelList: [],
};

const modelSlice = createSlice({
  name: "models",
  initialState: initialModelContainer,
  reducers: {
    setModels(state, action) {
      return action.payload ? { ...action.payload } : null;
    },
    updateModels(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

export const { setModels, updateModels } = modelSlice.actions;
export default modelSlice.reducer;
