import useUserStore from "@/context/useUserStore";
import OverViewSummary from "./OverViewSummary";
import ViewTourSummary from "./ViewTourSummary";
import FeedbackSummary from "./FeedbackSummary";
import UserSummary from "./UserSummary";
import UsageTrends from "./UsageTrends";
import AccountActivityList from "./AccountActivityList.jsx";
import useToggleTheme from "@/context/useToggleTheme";

const Dashboard = () => {
  const { currentUser } = useUserStore((state) => state);
  const { isDarkMode } = useToggleTheme((state) => state);

  return (
    <div className="flex flex-1 flex-col gap-5">
      <div className={`mb-3 ${isDarkMode ? "text-dark-text-base-300" : ""}`}>
        <p className="text-[1.3rem] font-semibold">Dashboard</p>
        <p className={"mt-2"}>
          Welcome,
          <span className="ml-1 font-semibold">{currentUser?.username}</span>!
        </p>
        <p
          className={`text-[0.9rem] ${isDarkMode ? "text-dark-text-base-300-75" : "text-secondary-100/60"}`}
        >
          Your dashboard gives you an overview of key metrics, user
          intercations, and system health to help you manage and enhance
          GuideURSelf efficiently
        </p>
      </div>

      <OverViewSummary />

      <div className="flex gap-5">
        <div className="flex flex-1 flex-col gap-5">
          <ViewTourSummary />
          <FeedbackSummary />
        </div>

        <div className="flex flex-1">
          <UserSummary />
        </div>
      </div>

      <UsageTrends />

      <AccountActivityList />
    </div>
  );
};

export default Dashboard;
