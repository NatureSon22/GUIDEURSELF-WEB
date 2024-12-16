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
        path: "/dashboard",
        icon: <MdDashboard />,
      },
      {
        title: "Documents",
        path: "/documents",
        icon: <FaFolder />,
      },
      {
        title: "Virtual Tour",
        path: "/virtual-tour",
        icon: <FaLocationDot />,
      },
    ],
  },
  {
    sectionTitle: "University Management",
    modules: [
      {
        title: "Key Officials",
        path: "/key-officials",
        icon: <BsPersonCircle />,
      },
      {
        title: "Campus",
        path: "/campus",
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
        icon: <IoPerson />,
      },
      {
        title: "Roles & Permissions",
        path: "/roles-permissions",
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
        icon: <FaFileAlt />,
      },
      {
        title: "Settings",
        path: "/settings",
        icon: <BsGearFill />,
      },
    ],
  },
];

export default SideBarElements;
