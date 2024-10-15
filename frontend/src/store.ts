import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { pageSlice } from "./features/Page/PageSlice";
import { cartModalSlice } from "./features/CartModal";
import { productListSlice } from "./features/ProductList";
import { productDetailsSlice } from "./features/ProductDetails";
import { setupListeners } from "@reduxjs/toolkit/query";

const rootReducer = combineReducers({
  page: pageSlice.reducer,
  cartModal: cartModalSlice.reducer,
  productList: productListSlice.reducer,
  productDetails: productDetailsSlice.reducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware()
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
