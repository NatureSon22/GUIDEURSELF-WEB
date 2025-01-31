import PageNotFound from "./pages/PageNotFound.jsx";
import Login from "./pages/auth/Login.jsx";
import Container from "./components/Container";
import AuthLayer from "./layer/AuthLayer";
import App from "./App.jsx";
import { Navigate } from "react-router-dom";
import {
  Dashboard,
  VirtualTour,
  VirtualTourDashboard,
  BuildMode,
  EditMode,
  KeyOfficials,
  EditKeyOfficials,
  DisplayingKeyOfficials,
  Campus,
  DisplayCampus,
  AddNewCampus,
  EditCampus,
  EditDisplayCampus,
  Accounts,
  ImportAddAccount,
  AddAccount,
  EditAccount,
  Roles,
  EditAssignRole,
  Settings,
  CampusDocument,
  AllDocuments,
  CreateNewDocument,
  ViewDocument,
  UploadDocument,
  WebDocument,
  TestChat,
  Reports,
  AccountReports,
  FeedbackReport,
  UserActivityReport,
  GeneralSettings,
  AccountManagement,
  UniversityManagement,
  UserManagement,
  PrivacyPolicySetting,
  ReportsTemplate,
  Archive,
  AssignRole,
  LegalContainer,
  TermsOfService,
  PrivacyPolicy,
} from "./routescomponents.jsx";
import NetworkLayer from "./layer/NetworkLayer.jsx";
import EditAssignRoleRefined from "./pages/roles/EditAssignRoleRefined.jsx";
import ResendPassword from "./pages/auth/ResendPassword.jsx";

const routes = [
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
            element: <CampusDocument />,
          },
          {
            path: "/documents/all-documents",
            element: <AllDocuments />,
          },
          {
            path: "/documents/write-document/:documentId?",
            element: <CreateNewDocument />,
          },
          {
            path: "/documents/upload-document/:documentId?",
            element: <UploadDocument />,
          },
          {
            path: "/documents/import-website/:documentId?",
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
          {
            path: "media-library",
            element: <MediaLibrary />,
          },
        ],
      },
      {
        path: "/key-officials",
        element: (
          <NetworkLayer>
            <KeyOfficials />
          </NetworkLayer>
        ),
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
        element: (
          <NetworkLayer>
            <Campus />
          </NetworkLayer>
        ),
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
          // {
          //   path: "/roles-permissions/edit-assign-role/:accountId",
          //   element: <EditAssignRole />,
          // },
          {
            path: "/roles-permissions/edit-assign-role",
            element: <EditAssignRoleRefined />,
          },
          {
            path: "/roles-permissions/assign-role",
            element: <AssignRole />,
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
              {
                path: "/settings/archives",
                element: <Archive />,
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
    path: "/forgot-password",
    element: <ResendPassword />,
  },
  {
    path: "/legal",
    element: <LegalContainer />,
    children: [
      {
        path: "terms",
        element: <TermsOfService />,
        index: true,
      },
      {
        path: "privacy",
        element: <PrivacyPolicy />,
      },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
];

export default routes;