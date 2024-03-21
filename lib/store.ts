import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
// import thunk from "redux-thunk";
import authSlice from "./Slicers/authSlice";


const reducers = combineReducers({
    auth: authSlice,
});

const persistConfig = {
    key: "root",
    whitelist: ["auth"],
    blacklist: [],
    storage
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== "production",
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
});

let persistor = persistStore(store);

export { persistor };

export default store;
