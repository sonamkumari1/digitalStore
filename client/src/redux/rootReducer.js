import { combineReducers } from "@reduxjs/toolkit"; 
import { authApi } from "./api/authApi";
import { projectApi } from "./api/projectApi";
import authReducer from "./authSlice";
import { cartApi } from "./api/cartApi";
import { purchaseApi } from "./api/purchaseApi";


const rootReducer = combineReducers({
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [projectApi.reducerPath]:projectApi.reducer,
    [cartApi.reducerPath]:cartApi.reducer,
    [purchaseApi.reducerPath]:purchaseApi.reducer
});



export default rootReducer;
