import { SendNotification } from "./../types/common";
import { configureStore, createAction } from "@reduxjs/toolkit";
import messageReducer from "./slices/messageSlice";
import userSlice from "./slices/userSlice";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import userPostSlice from "./slices/userPostSlice";
import modelSlice from "./slices/modelSlice";
import { ReduxUser, SearchCreator } from "@/types/user";
import { DiscoverPost, Post } from "@/types/post";
import { ModelContainer } from "@/types/ai";
import discoverFeedSlice from "./slices/discoverFeedSlice";
import discoverSimilarFeedSlice from "./slices/discoverSimilarFeedSlice";
import viewedNSFWSlice from "./slices/viewedNSFWSlice";
import circleFeedSlice from "./slices/circleFeedSlice";
import creatorListSlice from "./slices/creatorListSlice";
import paymentStatusSlice, {
  PaymentMethodStatus,
} from "./slices/paymentStatusSlice";

interface InitState {
  message: null;
  user: ReduxUser | null;
  userPosts: Post[];
  discoverPosts: DiscoverPost[];
  discoverSimilarPosts: Post[];
  models: ModelContainer;
  viewedNSFW: string[];
  circlePosts: Post[];
  creators: SearchCreator[];
  payments: PaymentMethodStatus;
}

type RootAction = any;

const persistConfig = {
  key: "root",
  storage,
};

const appReducer = combineReducers({
  message: messageReducer,
  user: userSlice,
  userPosts: userPostSlice,
  discoverPosts: discoverFeedSlice,
  discoverSimilarPosts: discoverSimilarFeedSlice,
  models: modelSlice,
  viewedNSFW: viewedNSFWSlice,
  circlePosts: circleFeedSlice,
  creators: creatorListSlice,
  payments: paymentStatusSlice,
});

export const clearAll = createAction("USER_LOGOUT");

const rootReducer = (state: InitState | undefined, action: RootAction) => {
  if (action.type === "USER_LOGOUT") {
    storage.removeItem("persist:root");
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

export type RootState = ReturnType<typeof rootReducer>;

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
