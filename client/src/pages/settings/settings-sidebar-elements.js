const sidebarElements = [
  {
    title: "General Settings",
    path: "/general-settings",
    access: "edit system settings",
  },
  {
    title: "Account Management",
    path: "/account-management",
    access: "edit account profile",
  },
  {
    title: "University Management",
    path: "/university-management",
    access: "edit university management",
  },
  {
    title: "User Management",
    path: "/user-management",
    access: "edit user management",
  },
  {
    title: "Privacy & Legal",
    access: "edit privacy policy",
    children: [
      {
        title: "Web",
        path: "/privacy-policy/web",
      },
      {
        title: "Mobile",
        path: "/privacy-policy/mobile",
      },
    ],
  },
  {
    title: "Archives",
    path: "/archives",
    access: "edit archives",
  },
];

export default sidebarElements;
