import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import refreshReducer from "../store/refreshSlice.js";
import userReducer from "../store/userSlice.js";
import tokenReducer from "../store/tokenSlice.js";



// 🛠️ 1. FIXED: Changed 'require' to a modern 'import' so Vite doesn't crash!
import { combineReducers, configureStore } from "@reduxjs/toolkit";

// 🛠️ 2. FIXED TYPO: Changed 'persitConfig' to 'persistConfig'
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "refresh", "token"],
};

const rootReducer = combineReducers({
  refresh: refreshReducer,
  token: tokenReducer,
  user: userReducer,


});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  // 🛠️ 3. PRO-TIP FIXED: This middleware stops Redux Toolkit from throwing red errors in your console!
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE", "persist/REGISTER"],
      },
    }),
});

// 🛠️ 4. FIXED TYPO: Changed 'persitor' to 'persistor' (This caused your exact error!)
export const persistor = persistStore(store);