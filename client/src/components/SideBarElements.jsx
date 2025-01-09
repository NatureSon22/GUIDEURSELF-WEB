import { MdDashboard } from "react-icons/md";
import { FaFolder } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { BsPersonCircle } from "react-icons/bs";
import { FaBuilding } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { BsPersonFillAdd } from "react-icons/bs";
import { FaFileAlt } from "react-icons/fa";
import { BsGearFill } from "react-icons/bs";

const SideBarElements = [
  {
    sectionTitle: "Main",
    modules: [
      {
        title: "Dashboard",
        isPublic: true,
        path: "/dashboard",
        icon: <MdDashboard />,
      },
      {
        title: "Documents",
        isPublic: false,
        path: "/documents",
        module: "Manage Documents",
        icon: <FaFolder />,
      },
      {
        title: "Virtual Tour",
        isPublic: false,
        path: "/virtual-tour",
        module: "Manage Virtual Tour",
        icon: <FaLocationDot />,
      },
    ],
  },
  {
    sectionTitle: "University Management",
    modules: [
      {
        title: "Key Officials",
        isPublic: true,
        path: "/key-officials",
        icon: <BsPersonCircle />,
      },
      {
        title: "Campus",
        isPublic: true,
        path: "/campus",
        module: "Manage Campus",
        icon: <FaBuilding />,
      },
    ],
  },
  {
    sectionTitle: "User Management",
    modules: [
      {
        title: "Accounts",
        isPublic: false,
        path: "/accounts",
        module: "Manage Accounts",
        icon: <IoPerson />,
      },
      {
        title: "Roles & Permissions",
        isPublic: false,
        path: "/roles-permissions",
        module: "Manage Roles and Permissions",
        icon: <BsPersonFillAdd />,
      },
    ],
  },
  {
    sectionTitle: "Others",
    modules: [
      {
        title: "Reports",
        isPublic: true,
        path: "/reports",
        icon: <FaFileAlt />,
      },
      {
        title: "Settings",
        isPublic: false,
        path: "/settings",
        module: "Manage System Setting",
        icon: <BsGearFill />,
      },
    ],
  },
];

export default SideBarElements;
