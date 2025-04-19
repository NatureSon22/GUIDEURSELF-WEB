import { MdDashboard } from "react-icons/md";
import { FaFolder } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { BsPersonCircle } from "react-icons/bs";
import { FaBuilding } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { BsPersonFillAdd } from "react-icons/bs";
import { FaFileAlt } from "react-icons/fa";
import { BsGearFill } from "react-icons/bs";
import { BiSolidMessage } from "react-icons/bi";

const SideBarElements = [
  {
    sectionTitle: "Main",
    modules: [
      {
        title: "Dashboard",
        path: "/dashboard",
        module: "Manage Dashboard",
        icon: <MdDashboard />,
      },
      {
        title: "Documents",
        path: "/documents",
        module: "Manage Documents",
        icon: <FaFolder />,
      },
      {
        title: "Virtual Tour",
        path: "/virtual-tour",
        module: "Manage Virtual Tour",
        icon: <FaLocationDot />,
      },
      {
        title: "Chats",
        path: "/chats",
        module: "Manage Chats",
        icon: <BiSolidMessage />,
      },
    ],
  },
  {
    sectionTitle: "University Management",
    modules: [
      {
        title: "Key Officials",
        path: "/key-officials",
        module: "Manage Key Officials",
        icon: <BsPersonCircle />,
      },
      {
        title: "Campus",
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
        path: "/accounts",
        module: "Manage Accounts",
        icon: <IoPerson />,
      },
      {
        title: "User Permissions",
        path: "/user-permissions",
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
        path: "/reports",
        module: "Manage Reports",
        icon: <FaFileAlt />,
      },
      {
        title: "Settings",
        path: "/settings",
        module: "Manage System Settings",
        icon: <BsGearFill />,
      },
    ],
  },
];

export default SideBarElements;
