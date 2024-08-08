import { combineReducers, createStore } from "redux";
const initialCustomerState = {
  fullName: "",
  nationalId: "",
  createdAt: "",
};

const initialAccountState = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
};
function accountReducer(state = initialAccountState, action) {
  switch (action.type) {
    case "account/deposit":
      return { ...state, balance: state.balance + action.payload };
    case "account/withdraw":
      return { ...state, balance: state.balance - action.payload };
    case "account/requestLoan":
      if (state.loan > 0) return state;
      return {
        ...state,
        loan: action.payload.amount,
        loanPurpose: action.payload.purpose,
        balance: state.balance + action.payload.amount,
      };

    case "account/payloan":
      return {
        ...state,
        loanPurpose: "",
        balance: state.balance - state.loan,
        loan: 0,
      };
    default:
      return state;
  }
}

function customerReducer(state = initialCustomerState, action) {
  switch (action.type) {
    case "customer/createCustomer":
      return { ...state, fullName: action.payload, nationalId: action.payload };

    case "customer/updateName":
      return { ...state, fullName: action.payload };
    default:
      return state;
  }
}
const rootReduce = combineReducers({
  account: accountReducer,
  customer: customerReducer,
});
const store = createStore(rootReduce);
// store.dispatch({ type: "account/deposit", payload: 300 });
// store.dispatch({ type: "account/withdraw", payload: 200 });
// store.dispatch({
//   type: "account/requestLoan",
//   payload: { amount: 200, purpose: "buy a car" },
// });

function deposit(amount) {
  return { type: "account/deposit", payload: amount };
}

function withdraw(amount) {
  return { type: "account/withdraw", payload: amount };
}

function requestLoan(amount, purpose) {
  return {
    type: "account/requestLoan",
    payload: { amount, purpose },
  };
}

function payloan() {
  return { type: "account/payloan" };
}

function createCustomer(fullName, nationalId) {
  return {
    type: "customer/createCustomer",
    payload: { fullName, nationalId, createdAt: new Date().toISOString() },
  };
}

store.dispatch(deposit(200));
store.dispatch(withdraw(100));
store.dispatch(requestLoan(1000, "buy a car"));
store.dispatch(payloan());

store.dispatch(createCustomer("vikcy", "1212"));
console.log(store.getState());
