import { configureStore } from "@reduxjs/toolkit";
import eventReducer from "./slices/eventSlice";
import authReducer from "../features/auth/authSlice";
import checkoutReducer from "./slices/checkoutSlice";
import paymentReducer from "./slices/paymentSlice";
import messageReducer from "./slices/messageSlice";


export const store = configureStore({
  reducer: {
    events: eventReducer,
    auth: authReducer,
    checkout: checkoutReducer,
    payment: paymentReducer,
    messages:messageReducer
  },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['checkout/saveCheckout/fulfilled'],
        ignoredPaths: ['checkout.data.createdAt'],
      },
    }),
});
