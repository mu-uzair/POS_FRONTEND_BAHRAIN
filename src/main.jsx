// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { Provider } from 'react-redux';
// import store from "./redux/store.js";
// import { SnackbarProvider } from "notistack"
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// const reactQueryClient = new QueryClient({

//   defaultOptions: {
//     queries: {
//       staleTime: 30000,
//     }
//   }

// })


// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <Provider store={store}>
//       <SnackbarProvider autoHideDuration={3000}>
//         <QueryClientProvider client={reactQueryClient}>
//           <App />
//         </QueryClientProvider>
//       </SnackbarProvider>
//     </Provider>
//   </StrictMode>,
// )


// Modified main.jsx
// to include Service Worker registration
// add this for iphone login issue line 36 and 37
import axios from "axios";
axios.defaults.withCredentials = true;

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { SnackbarProvider } from "notistack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const reactQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
    },
  },
});

// 📌 REGISTER SERVICE WORKER (for offline support / PWA)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/serviceWorker.js") // ⚠️ must be in your public/ folder
      .then((registration) => {
        console.log("✅ Service Worker registered:", registration.scope);
      })
      .catch((error) => {
        console.log("❌ Service Worker registration failed:", error);
      });
  });
}
// 📌 END SERVICE WORKER

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <SnackbarProvider autoHideDuration={3000}>
        <QueryClientProvider client={reactQueryClient}>
          <App />
        </QueryClientProvider>
      </SnackbarProvider>
    </Provider>
  </StrictMode>
);
