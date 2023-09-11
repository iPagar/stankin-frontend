import { createStore, compose, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import rootReducer from "./reducers";

function logger({ getState }) {
  return (next) => (action) => {
    // Call the next dispatch method in the middleware chain.
    const returnValue = next(action);

    // This will likely be the action itself, unless
    // a middleware further in chain changed it.
    return returnValue;
  };
}

function callAPIMiddleware({ dispatch, getState }) {
  return (next) => (action) => {
    const { request, callAPI, payload = {} } = action;

    if (!request) {
      // Normal action: pass it on
      return next(action);
    }

    if (typeof request !== "string") {
      throw new Error("Expected request to be a string.");
    }

    if (typeof callAPI !== "function") {
      throw new Error("Expected callAPI to be a function.");
    }

    const requestType = request + "_REQUEST",
      successType = request + "_SUCCESS",
      failureType = request + "_FAILURE";

    dispatch(
      Object.assign({}, payload, {
        type: requestType,
      })
    );

    return callAPI().then(
      (response) =>
        dispatch(
          Object.assign({}, payload, {
            response: response.data,
            type: successType,
          })
        ),
      (error) =>
        dispatch(
          Object.assign({}, payload, {
            error,
            type: failureType,
          })
        )
    );
  };
}

const middlewares = [
  applyMiddleware(callAPIMiddleware),
  process.env.NODE_ENV === "development" && applyMiddleware(logger),
  applyMiddleware(thunkMiddleware),
].filter(Boolean);

export default createStore(rootReducer, compose(...middlewares));
