import { configureStore } from "@reduxjs/toolkit";
import eventReducer from "./slices/eventSlice";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    events: eventReducer,
    auth: authReducer,
  },
});
