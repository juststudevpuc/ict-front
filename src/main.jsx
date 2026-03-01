import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.jsx"; 
import "./index.css";

// 1. Import Provider AND PersistGate
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

// 2. Import BOTH store and persistor from your store.js!
import { store, persistor } from "./store/store"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* 3. Wrap your App inside the PersistGate */}
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);