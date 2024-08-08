import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
  error: "",
  status: "idle",
};

export const convertCurrency = createAsyncThunk(
  "account/convertCurrency",

  async function ({ depositAmount, currency }) {
    // const { depositAmount, currency } = convert;
    const host = "api.frankfurter.app";
    const res = await fetch(
      `https://${host}/latest?amount=${depositAmount}&from=${currency}&to=USD`
    );
    const data = await res.json();
    const converted = data.rates.USD;
    return converted;
  }
);
const accountReducer = createSlice({
  name: "account",
  initialState,
  reducers: {
    deposit: {
      prepare(amount, currency) {
        return {
          payload: { amount, currency },
        };
      },
      reducer(state, action) {
        if (action.payload.currency === "USD")
          state.balance = state.balance + action.payload.amount;
      },
    },
    withdraw(state, action) {
      state.balance = state.balance - action.payload;
    },

    requestLoan: {
      prepare(amount, purpose) {
        return {
          payload: { amount, purpose },
        };
      },
      reducer(state, action) {
        if (state.loan > 0) return;
        state.loan = action.payload.amount;
        state.balance = state.balance + action.payload.amount;
        state.loanPurpose = action.payload.purpose;
      },
    },
    payloan(state) {
      if (state.balance < state.loan) return;
      state.balance = state.balance - state.loan;
      state.loan = 0;
      state.loanPurpose = "";
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(convertCurrency.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(convertCurrency.fulfilled, (state, action) => {
        state.status = "idle";
        state.balance = state.balance + action.payload;
      })
      .addCase(convertCurrency.rejected, (state, action) => {
        state.error = action.error.message;
      }),
});

export const { deposit, withdraw, requestLoan, payloan } =
  accountReducer.actions;

export default accountReducer.reducer;

// export function deposit(amount, currency) {
//   if (currency === "USD") return { type: "account/deposit", payload: amount };

//   //getState => is current state
//   return async function (dispatch, getState) {
//     dispatch({ type: "account/convertingCurrency" });
//     const host = "api.frankfurter.app";
//     const res = await fetch(
//       `https://${host}/latest?amount=${amount}&from=${currency}&to=USD`
//     );
//     const data = await res.json();
//     const converted = data.rates.USD;

//     dispatch({ type: "account/deposit", payload: converted });
//   };
// }
