import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRouter from "./routes/AppRouter.jsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
//import { AuthProvider } from './context/AuthContext.jsx';
import AuthListener from "./features/auth/AuthListener.jsx";
import { Toaster } from "react-hot-toast";
import "leaflet/dist/leaflet.css"; //Map
import ScrollToTop from "./components/ScrollToTop.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
         <ScrollToTop />
        <AuthListener>
          <AppRouter />
        </AuthListener>
        <Toaster position="top-center" />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
