import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "./customer/customerSlice";
import accountReducer from "./account/accountSlice";
const store = configureStore({
  reducer: {
    customer: customerReducer,
    account: accountReducer,
  },
});

export default store;
