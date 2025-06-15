import i18n from "i18next";
import React from "react";
import ReactDOM from "react-dom/client";
import { initReactI18next } from "react-i18next";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import "./css/common.module.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import localeResources from "./locale-resources";
import { store } from "./store/Store";
import App from "./App";
import { LocalizationProvider } from "@mui/x-date-pickers";

//const app = initializeApp(firebaseConfig);
const persistor = persistStore(store);

i18n.use(initReactI18next).init({
  resources: localeResources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

//getAnalytics(app);
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </LocalizationProvider>
  </React.StrictMode>
);
