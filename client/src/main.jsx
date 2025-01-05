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
import Campus from "./pages/campus/Campus";
import Accounts from "./pages/accounts/Accounts.jsx";
import Roles from "./pages/roles/Roles.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthLayer from "./layer/AuthLayer";import DisplayCampus from "./pages/Campus/DisplayCampus";
import AddNewCampus from "./pages/Campus/AddNewCampus";
import Container from "./components/Container";
import EditAssignRole from "./pages/roles/Roles";
import UserManagement from "./pages/settings/user-management/UserManagement";
import ImportAddAccount from "./pages/accounts/ImportAddAccount";
import AddAccount from "./pages/accounts/AddAccount";
import EditAccount from "./pages/accounts/EditAccount";
import Settings from "./pages/settings/Settings";
import GeneralSettings from "./pages/settings/general-settings/GeneralSettings";
import AccountManagement from "./pages/settings/account-management/AccountManagement";
import EditCampus from "./pages/campus/EditCampus";
import EditDisplayCampus from "./pages/campus/EditDisplayCampus";
import UniversityManagement from "./pages/settings/university-management/UniversityManagement";
import PrivacyPolicySetting from "./pages/settings/privacy-policy/PrivacyPolicySetting";

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
        children:
          [
              {
                path: "",
                element: <DisplayCampus />,
              },
              {
                path: "add",
                element: <AddNewCampus />,
              },
              {
                path: "edit",
                element: <EditDisplayCampus />,
              },
              {
                path: "edit-campus/:id",
                element: <EditCampus />,
              }
          ]
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
                path: "/settings/university-management",
                element: <UniversityManagement />
              },
              {
                path: "/settings/user-management",
                element: <UserManagement />,
              },
              
              {
                path: "/settings/privacy-policy",
                element: <PrivacyPolicySetting />,
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
