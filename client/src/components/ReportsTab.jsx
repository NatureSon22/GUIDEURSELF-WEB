import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const ReportsTab = ({ icon, title, subtitle, path }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (path) {
      navigate(`/reports/${path}`);
    } else {
      console.error("Navigation path is missing");
    }
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      role="button"
      tabIndex={0}
      className="group flex cursor-pointer items-center gap-6 rounded-md border border-secondary-200/70 bg-white px-8 py-4"
    >
      {icon}
      <div>
        <p className="font-medium transition-colors duration-150 ease-in-out group-hover:text-base-200">
          {title}
        </p>
        <p className="text-[0.87rem] text-secondary-100-75 transition-colors duration-150 ease-in-out group-hover:text-base-200">
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
