import { FaUserGroup } from "react-icons/fa6";
import { TbMessageCircleFilled } from "react-icons/tb";
import { IoTv } from "react-icons/io5";

const ReportsTabInfo = [
  {
    icon: (
      <FaUserGroup className="text-4xl transition-colors duration-150 ease-in-out group-hover:text-base-200" />
    ),
    title: "User Account",
    subtitle: "Access, review, and generate reports on user account records",
    path: "account",
  },
  {
    icon: (
      <TbMessageCircleFilled className="text-4xl transition-colors duration-150 ease-in-out group-hover:text-base-200" />
    ),
    title: "Feedback",
    subtitle: "Access, review, and generate reports on user feedback",
    path: "feedback",
  },
  {
    icon: (
      <IoTv className="text-4xl transition-colors duration-150 ease-in-out group-hover:text-base-200" />
    ),
    title: "User Activity Log",
    subtitle: "Access, review, and generate reports on user activity logs",
    path: "user-activity-log",
  },
];

export default ReportsTabInfo;
