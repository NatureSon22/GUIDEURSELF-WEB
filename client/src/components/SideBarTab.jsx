import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const SideBarTab = ({ title, icon, path, setSchosen, chosen }) => {
  const navigate = useNavigate();

  const isActive = chosen === path;

  return (
    <div
      className={`relative flex cursor-pointer items-center gap-5 px-7 py-[0.9rem] text-base-300 transition-all duration-100 ease-in-out ${
        isActive
          ? "bg-base-200/10 before:absolute before:inset-y-0 before:left-0 before:w-2 before:rounded-r-md before:bg-base-200"
          : "bg-white hover:bg-slate-50"
      }`}
      onClick={() => {
        setSchosen(path);
        navigate(path);
      }}
    >
      <div
        className={`text-[1.48rem] transition-colors duration-100 ease-in-out ${isActive ? "text-base-200" : "text-base-300"}`}
      >
        {icon}
      </div>
      <p
        className={`text-[0.94rem] transition-colors duration-100 ease-in-out ${isActive ? "font-medium text-base-200" : "text-base-300"}`}
      >
        {title}
      </p>
    </div>
  );
};

SideBarTab.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  path: PropTypes.string.isRequired,
  chosen: PropTypes.string.isRequired,
  setSchosen: PropTypes.func.isRequired,
};

export default SideBarTab;
