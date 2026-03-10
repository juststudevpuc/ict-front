import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import refreshReducer from "../store/refreshSlice.js";
import userReducer from "../store/userSlice.js";
import tokenReducer from "../store/tokenSlice.js";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import SecureLS from "secure-ls";


// 🛠️ 1. FIXED: Changed 'require' to a modern 'import' so Vite doesn't crash!



const ls = new SecureLS({ encodingType: "aes" });

// 2. Create a custom storage engine for Redux Persist
const secureStorage = {
  getItem: (key) => {
    try {
      return Promise.resolve(ls.get(key));
    } catch (error) {
      return Promise.resolve(null);
    }
  },
  setItem: (key, value) => {
    try {
      ls.set(key, value);
      return Promise.resolve();
    } catch (error) {
      return Promise.resolve();
    }
  },
  removeItem: (key) => {
    try {
      ls.remove(key);
      return Promise.resolve();
    } catch (error) {
      return Promise.resolve();
    }
  },
};
// 🛠️ 2. FIXED TYPO: Changed 'persitConfig' to 'persistConfig'
const persistConfig = {
  key: "root",
  storage:secureStorage,
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