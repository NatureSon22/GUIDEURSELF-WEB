import { lazy } from "react";

// Dashboard & Virtual Tour
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard.jsx"));
const VirtualTour = lazy(() => import("./pages/virtual_tour/VirtualTour.jsx"));
const MediaLibrary = lazy(() => import("./pages/virtual_tour/MediaLibrary"));
const VirtualTourDashboard = lazy(
  () => import("./pages/virtual_tour/VirtualTourDashboard.jsx"),
);

const BuildMode = lazy(() => import("./pages/virtual_tour/BuildMode.jsx"));
const BuildModeII = lazy(() => import("./pages/virtual_tour/BuildModeII.jsx"));
const EditMode = lazy(() => import("./pages/virtual_tour/EditMode.jsx"));

// Key Officials
const KeyOfficials = lazy(
  () => import("./pages/key_officials/KeyOfficials.jsx"),
);
const EditKeyOfficials = lazy(
  () => import("./pages/key_officials/EditKeyOfficials.jsx"),
);
const DisplayingKeyOfficials = lazy(
  () => import("./pages/key_officials/DisplayKeyOfficials.jsx"),
);

// Campus
const Campus = lazy(() => import("./pages/campus/Campus.jsx"));
const DisplayCampus = lazy(() => import("./pages/campus/DisplayCampus.jsx"));
const AddNewCampus = lazy(() => import("./pages/campus/AddNewCampus.jsx"));
const EditCampus = lazy(() => import("./pages/campus/EditCampus.jsx"));
const EditDisplayCampus = lazy(
  () => import("./pages/campus/EditDisplayCampus.jsx"),
);

// Accounts
const Accounts = lazy(() => import("./pages/accounts/Accounts.jsx"));
const ImportAddAccount = lazy(
  () => import("./pages/accounts/ImportAddAccount.jsx"),
);
const AddAccount = lazy(() => import("./pages/accounts/AddAccount.jsx"));
const EditAccount = lazy(() => import("./pages/accounts/EditAccount.jsx"));

// Roles
const Roles = lazy(() => import("./pages/roles/Roles.jsx"));
const EditAssignRole = lazy(() => import("./pages/roles/EditAssignRole.jsx"));
const AssignRole = lazy(() => import("./pages/roles/AssignRole.jsx"));

// Settings
const Settings = lazy(() => import("./pages/settings/Settings.jsx"));
const GeneralSettings = lazy(
  () => import("./pages/settings/general-settings/GeneralSettings.jsx"),
);
const AccountManagement = lazy(
  () => import("./pages/settings/account-management/AccountManagement.jsx"),
);
const UniversityManagement = lazy(
  () =>
    import("./pages/settings/university-management/UniversityManagement.jsx"),
);
const UserManagement = lazy(
  () => import("./pages/settings/user-management/UserManagement.jsx"),
);
const PrivacyPolicySetting = lazy(
  () => import("./pages/settings/privacy-policy/PrivacyPolicySetting.jsx"),
);
const PrivacyPolicyWebSetting = lazy(
  () => import("./pages/settings/privacy-policy/PrivacyPolicyWebSetting.jsx"),
);
const PrivacyPolicyMobileSetting = lazy(
  () => import("./pages/settings/privacy-policy/PrivacyPolicyMobileSetting.jsx"),
);
const ReportsTemplate = lazy(
  () => import("./pages/settings/reports-template/ReportsTemplate.jsx"),
);
const Archive = lazy(() => import("./pages/settings/archive/Archive.jsx"));

// Documents
const AllCampusDocuments = lazy(
  () => import("./pages/documents/AllCampusDocuments.jsx"),
);
const CampusDocument = lazy(
  () => import("./pages/documents/CampusDocument.jsx"),
);
const AllDocuments = lazy(() => import("./pages/documents/AllDocuments.jsx"));
const CreateNewDocument = lazy(
  () => import("./pages/documents/CreateNewDocument.jsx"),
);
const ViewDocument = lazy(() => import("./pages/documents/ViewDocument.jsx"));
const EditCreatedDocument = lazy(
  () => import("./pages/documents/EditCreatedDocument.jsx"),
);
const UploadDocument = lazy(
  () => import("./pages/documents/UploadDocument.jsx"),
);
const WebDocument = lazy(() => import("./pages/documents/WebDocument.jsx"));
const TestChat = lazy(() => import("./pages/documents/TestChat.jsx"));

// Chats
const Chats = lazy(() => import("./pages/chats/Chats.jsx"));

// Reports
const Reports = lazy(() => import("./pages/reports/Reports.jsx"));
const AccountReports = lazy(() => import("./pages/reports/AccountReports.jsx"));
const FeedbackReport = lazy(() => import("./pages/reports/FeedbackReport.jsx"));
const UserActivityReport = lazy(
  () => import("./pages/reports/UserActivityReport.jsx"),
);

// Legal
const LegalContainer = lazy(() => import("./pages/legal/LegalContainer.jsx"));
const Policy = lazy(() => import("./pages/legal/Policy.jsx"));
const TermsOfService = lazy(() => import("./pages/legal/TermsOfService.jsx"));

export {
  Dashboard,
  VirtualTour,
  VirtualTourDashboard,
  BuildMode,
  BuildModeII,
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
  AssignRole,
  Settings,
  GeneralSettings,
  AccountManagement,
  UniversityManagement,
  UserManagement,
  PrivacyPolicySetting,
  PrivacyPolicyWebSetting,
  PrivacyPolicyMobileSetting,
  ReportsTemplate,
  Archive,
  AllCampusDocuments,
  CampusDocument,
  AllDocuments,
  CreateNewDocument,
  EditCreatedDocument,
  ViewDocument,
  UploadDocument,
  WebDocument,
  TestChat,
  Reports,
  AccountReports,
  FeedbackReport,
  UserActivityReport,
  LegalContainer,
  TermsOfService,
  Policy,
  MediaLibrary,
  Chats,
};
