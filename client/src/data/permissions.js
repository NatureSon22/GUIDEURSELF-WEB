const PERMISSIONS = [
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
      "Check the permissions granted for managing virtual tour on their assigned campus",
    access: [
      "upload map and panaromic images",
      "edit map and panaromic images",
      "modify tour paths or pins",
      "archive virtual tour",
    ],
  },
  {
    module: "Manage Campus",
    description:
      "Check the permissions granted for managing campus on their assigned campus",
    access: ["add campus", "edit campus", "archive campus"],
  },
  {
    module: "Manage Accounts",
    description:
      "Check the permissions granted for managing accounts on their assigned campus",
    access: ["add account", "edit account", "archive account"],
  },
  {
    module: "Manage Roles and Permissions",
    
    description:
      "Check the permissions granted for managing roles and permissions on their assigned campus",
    access: ["add role", "edit role", "archive role"],
  },
  {
    module: "Manage System Setting",
    description:
      "Check the permissions granted for managing system settings on their assigned campus",
    access: [
      "edit system settings",
      "edit account profile",
      "edit university management",
      "edit reports template",
      "edit privacy policy",
      "edit archives",
    ],
  },
];

export default PERMISSIONS;
