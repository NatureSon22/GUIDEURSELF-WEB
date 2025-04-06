import { FaUserGroup } from "react-icons/fa6";
import { TbMessageCircleFilled } from "react-icons/tb";
import { IoTv } from "react-icons/io5";
import { FaSquareCheck } from "react-icons/fa6";

const ReportsTabInfo = [
  {
    icon: (
      <FaUserGroup className="text-4xl transition-colors duration-150 ease-in-out group-hover:text-base-200" />
    ),
    title: "User Account",
    subtitle: "Access, review, and generate reports on user account records",
    path: "user-account-report",
  },
  {
    icon: (
      <TbMessageCircleFilled className="text-4xl transition-colors duration-150 ease-in-out group-hover:text-base-200" />
    ),
    title: "Feedback",
    subtitle: "Access, review, and generate reports on user feedback",
    path: "feedback-report",
  },
  {
    icon: (
      <IoTv className="text-4xl transition-colors duration-150 ease-in-out group-hover:text-base-200" />
    ),
    title: "User Activity Log",
    subtitle: "Access, review, and generate reports on user activity logs",
    path: "user-activity-log-report",
  },
  {
    icon: (
      <FaSquareCheck className="text-4xl transition-colors duration-150 ease-in-out group-hover:text-base-200" />
    ),
    title: "Response Review", // a better title?
    subtitle: "Generate reports on chatbot response effectiveness", // review the bot response
    path: "response-review-report",
  },
];

export default ReportsTabInfo;
