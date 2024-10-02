import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./user/user.slice";
import themereducer from "./theme/theme.slice";

const persistCongif = {
  key: "root",
  version: 1,
  storage,
};

const root = combineReducers({
  user: userReducer,
  theme: themereducer,
});

const persistedreducer = persistReducer(persistCongif, root);

export const store = configureStore({
  reducer: persistedreducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
