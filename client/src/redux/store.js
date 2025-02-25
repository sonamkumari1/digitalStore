import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { authApi } from "./api/authApi";
import { projectApi } from "./api/projectApi";
import { cartApi } from "./api/cartApi";
import { purchaseApi } from "./api/purchaseApi";

export const appStore = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      projectApi.middleware,
      cartApi.middleware,
      purchaseApi.middleware
    ),
});

const initializeApp = async () => {
  if (authApi.endpoints.loadUser) {
    await appStore.dispatch(
      authApi.endpoints.loadUser.initiate({}, { forceRefetch: true })
    );
  } else {
    console.error("Error: loadUser endpoint is undefined.");
  }
};

initializeApp();
