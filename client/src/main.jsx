import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PageNotFound from "./pages/PageNotFound.jsx";
import Login from "./pages/auth/Login.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Documents from "./pages/documents/Documents.jsx";
import VirtualTour from "./pages/virtual_tour/VirtualTour.jsx";
import KeyOfficials from "./pages/key_officials/KeyOfficials.jsx";
import Campus from "./pages/Campus/Campus.jsx";
import Accounts from "./pages/accounts/Accounts.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthLayer from "./layer/AuthLayer";
import AddAccount from "./pages/accounts/AddAccount";
import Container from "./components/Container";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <PageNotFound />,
    element: (
      <AuthLayer>
        <App />
      </AuthLayer>
    ),
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/documents",
        element: <Documents />,
      },
      {
        path: "/virtual-tour",
        element: <VirtualTour />,
      },
      {
        path: "/key-officials",
        element: <KeyOfficials />,
      },
      {
        path: "/campus",
        element: <Campus />,
      },
      {
        path: "/accounts",
        element: <Container />,
        children: [
          {
            path: "",
            element: <Accounts />,
          },
          {
            path: "/accounts/add-account",
            element: <AddAccount />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
