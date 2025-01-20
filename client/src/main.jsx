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
import VirtualTour from "./pages/virtual_tour/VirtualTour.jsx";
import KeyOfficials from "./pages/key_officials/KeyOfficials.jsx";
import EditKeyOfficials from "./pages/key_officials/EditKeyOfficials.jsx";
import DisplayingKeyOfficials from "./pages/key_officials/DisplayKeyOfficials";
import Campus from "./pages/campus/Campus";
import Accounts from "./pages/accounts/Accounts.jsx";
import Roles from "./pages/roles/Roles.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthLayer from "./layer/AuthLayer";
import DisplayCampus from "./pages/Campus/DisplayCampus";
import AddNewCampus from "./pages/Campus/AddNewCampus";
import Container from "./components/Container";
import EditAssignRole from "./pages/roles/EditAssignRole";
import UserManagement from "./pages/settings/user-management/UserManagement";
import ImportAddAccount from "./pages/accounts/ImportAddAccount";
import AddAccount from "./pages/accounts/AddAccount";
import EditAccount from "./pages/accounts/EditAccount";
import Settings from "./pages/settings/Settings";
import GeneralSettings from "./pages/settings/general-settings/GeneralSettings";
import AccountManagement from "./pages/settings/account-management/AccountManagement";
import EditCampus from "./pages/campus/EditCampus";
import EditDisplayCampus from "./pages/campus/EditDisplayCampus";
import ReportsTemplate from "./pages/settings/reports-template/ReportsTemplate";
import UniversityManagement from "./pages/settings/university-management/UniversityManagement";
import PrivacyPolicySetting from "./pages/settings/privacy-policy/PrivacyPolicySetting";
import Reports from "./pages/reports/Reports";
import VirtualTourDashboard from "./pages/virtual_tour/VirtualTourDashboard";
import BuildMode from "./pages/virtual_tour/BuildMode";
import EditMode from "./pages/virtual_tour/EditMode";import AccountReports from "./pages/reports/AccountReports";
import FeedbackReport from "./pages/reports/FeedbackReport";
import UserActivityReport from "./pages/reports/UserActivityReport";
import AllCampusDocuments from "./pages/documents/AllCampusDocuments.jsx";
import CampusDocument from "./pages/documents/CampusDocument";
import AllDocuments from "./pages/documents/AllDocuments";
import CreateNewDocument from "./pages/documents/CreateNewDocument";
import ViewDocument from "./pages/documents/ViewDocument";
import UploadDocument from "./pages/documents/UploadDocument";
import WebDocument from "./pages/documents/WebDocument";
import TestChat from "./pages/documents/TestChat";

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
        element: <Container />,
        children: [
          {
            path: "",
            element: <AllCampusDocuments />,
            // element: <CampusDocument />,
            //<CreateNewDocument />,
            //element: <AllCampusDocuments />,
          },
          {
            path: "/documents/:campusId",
            element: <CampusDocument />,
          },
          {
            path: "/documents/all-documents",
            element: <AllDocuments />,
          },
          {
            path: "/documents/write-document",
            element: <CreateNewDocument />,
          },
          {
            path: "/documents/upload-document",
            element: <UploadDocument />,
          },
          {
            path: "/documents/import-website",
            element: <WebDocument />,
          },
          {
            path: "/documents/view/:docId",
            element: <ViewDocument />,
          },
          {
            path: "/documents/test-chat",
            element: <TestChat />,
          },
        ],
      },
      {
        path: "/virtual-tour",
        element: <VirtualTour />,
        children: [
          {
            path: "",
            element: <VirtualTourDashboard />,
          },
        ]
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
          {
            path: "edit",
            element: <EditDisplayCampus />,
          },
          {
            path: "edit-campus/:id",
            element: <EditCampus />,
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
        path: "/reports",
        element: <Container />,
        children: [
          {
            path: "",
            element: <Reports />,
          },
          {
            path: "/reports/account",
            element: <AccountReports />,
          },
          {
            path: "/reports/feedback",
            element: <FeedbackReport />,
          },
          {
            path: "/reports/user-activity-log",
            element: <UserActivityReport />,
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
                element: <AccountManagement />,
              },
              {
                path: "/settings/university-management",
                element: <UniversityManagement />,
              },
              {
                path: "/settings/user-management",
                element: <UserManagement />,
              },
              {
                path: "/settings/privacy-policy",
                element: <PrivacyPolicySetting />,
              },
              {
                path: "/settings/reports-template",
                element: <ReportsTemplate />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/virtual-tour/build-mode",
    element: (
      <AuthLayer>
        <BuildMode />
      </AuthLayer>
    ), 
  },
  {
    path: "/virtual-tour/edit-mode/:id",
    element: (
      <AuthLayer>
        <EditMode />
      </AuthLayer>
    ), 
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
