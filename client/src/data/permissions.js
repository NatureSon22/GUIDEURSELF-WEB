const PERMISSIONS = [
  // {
  //   module: "Enable multiple campus handling",
  //   description:
  //     "Check the permissions granted for enabling multiple campuses on the system",
  //   access: ["enable multiple campuses"],
  // },
  {
    module: "Manage Dashboard",
    description:
      "Check the permissions granted for accessing and managing the dashboard",
    access: ["view dashboard"],
  },
  {
    module: "Manage Documents",
    description:
      "Check the permissions granted for managing documents on their assigned campus",
    access: [
      "upload file",
      "edit file",
      "write document",
      "import website",
      "archive document",
    ],
  },
  {
    module: "Manage Virtual Tour",
    description:
      "Check the permissions granted for managing virtual tours on their assigned campus",
    access: [
      "upload map and panoramic images",
      "edit map and panoramic images",
      "modify tour paths or pins",
      "archive virtual tour",
    ],
  },
  {
    module: "Manage Chats",
    description:
      "Check the permissions granted for managing chats on their assigned campus",
    access: ["access chats"],
  },
  {
    module: "Manage Key Officials",
    description:
      "Check the permissions granted for managing university key officials",
    access: ["add key official", "edit key official", "archive key official"],
  },
  {
    module: "Manage Campus",
    description:
      "Check the permissions granted for managing campus details on their assigned campus",
    access: ["add campus", "edit campus", "archive campus"],
  },
  {
    module: "Manage Accounts",
    description:
      "Check the permissions granted for managing user accounts on their assigned campus",
    access: [
      "add account",
      "import account",
      "verify account",
      "edit account",
      "archive account",
    ],
  },
  {
    module: "Manage Roles and Permissions",
    description:
      "Check the permissions granted for managing roles and permissions on their assigned campus",
    access: [
      "add role",
      "edit role",
      "archive role",
      "assign role",
      "unassign role",
    ],
  },
  {
    module: "Manage Reports",
    description:
      "Check the permissions granted for managing reports on their assigned campus",
    access: ["add report", "edit report", "archive report", "generate report"],
  },
  {
    module: "Manage System Settings",
    description:
      "Check the permissions granted for managing system settings on their assigned campus",
    access: [
      "edit system settings",
      "edit account profile",
      "edit university management",
      "edit user management",
      "edit reports template",
      "edit privacy policy",
      "edit archives",
    ],
  },
];

export default PERMISSIONS;
