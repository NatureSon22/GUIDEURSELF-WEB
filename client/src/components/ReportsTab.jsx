import useToggleTheme from "@/context/useToggleTheme";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const ReportsTab = ({ icon, title, subtitle, path }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useToggleTheme((state) => state);

  const handleClick = () => {
    navigate(`/reports/${path}`);
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      role="button"
      tabIndex={0}
      className={`group flex cursor-pointer items-center gap-6 rounded-md border border-secondary-200/70 px-8 py-4 ${isDarkMode ? "bg-dark-base-bg" : "bg-white"} transition-colors duration-150`}
    >
      <div className={isDarkMode ? "text-dark-text-base-300-75" : ""}>
        {icon}
      </div>
      <div>
        <p
          className={`font-medium transition-colors duration-150 ease-in-out group-hover:text-base-200 ${isDarkMode ? "text-dark-text-base-300" : ""} `}
        >
          {title}
        </p>
        <p
          className={`text-[0.87rem] transition-colors duration-150 ease-in-out group-hover:text-base-200 ${isDarkMode ? "text-dark-secondary-100-75" : "text-secondary-100-75"} `}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
};

ReportsTab.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

export default ReportsTab;
