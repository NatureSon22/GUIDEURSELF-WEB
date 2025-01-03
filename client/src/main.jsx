import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import PageNotFound from "./pages/PageNotFound.jsx";
import Login from "./pages/auth/Login.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Documents from "./pages/documents/Documents.jsx";
import VirtualTour from "./pages/virtual_tour/VirtualTour.jsx";
import KeyOfficials from "./pages/key_officials/KeyOfficials.jsx";
import EditKeyOfficials from "./pages/key_officials/EditKeyOfficials.jsx";
import DisplayingKeyOfficials from "./pages/key_officials/DisplayKeyOfficials";
import Campus from "./pages/Campus/Campus.jsx";
import Accounts from "./pages/accounts/Accounts.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthLayer from "./layer/AuthLayer";
import DisplayCampus from "./pages/Campus/DisplayCampus";
import AddNewCampus from "./pages/Campus/AddNewCampus";
import Container from "./components/Container";
import Roles from "./pages/roles/Roles";
import EditAssignRole from "./pages/roles/Roles";
import UserManagement from "./pages/settings/user-management/UserManagement";
import ImportAddAccount from "./pages/accounts/ImportAddAccount";
import AddAccount from "./pages/accounts/AddAccount";
import EditAccount from "./pages/accounts/EditAccount";
import Settings from "./pages/settings/Settings";
import GeneralSettings from "./pages/settings/general-settings/GeneralSettings";
import AccountManagement from "./pages/settings/account-management/AccountManagement";

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
        path: "/",
        element: <Navigate to="/dashboard" />,
      },
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
        children: [
          {
            path: "",
            element: <DisplayingKeyOfficials />,
          },
          {
            path: "edit",
            element: <EditKeyOfficials />,
          },
        ],
      },
      {
        path: "/campus",
        element: <Campus />,
        children: [
          {
            path: "",
            element: <DisplayCampus />,
          },
          {
            path: "add",
            element: <AddNewCampus />,
          },
        ],
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
            path: "/accounts/import-add-account",
            element: <ImportAddAccount />,
          },
          {
            path: "/accounts/add-account",
            element: <AddAccount />,
          },
          {
            path: "/accounts/edit-account/:accountId",
            element: <EditAccount />,
          },
        ],
      },
      {
        path: "/roles-permissions",
        element: <Container />,
        children: [
          {
            path: "",
            element: <Roles />,
          },
          {
            path: "/roles-permissions/edit-assign-role/:accountId",
            element: <EditAssignRole />,
          },
        ],
      },
      {
        path: "/settings",
        element: <Container />,
        children: [
          {
            path: "",
            element: <Settings />,
            children: [
              {
                path: "/settings/general-settings",
                element: <GeneralSettings />,
              },
              {
                path: "/settings/account-management",
                element: <AccountManagement />
              },
              {
                path: "/settings/user-management",
                element: <UserManagement />,
              },
            ],
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
