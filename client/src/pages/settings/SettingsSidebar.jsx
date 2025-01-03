import { useNavigate } from "react-router-dom";
import settingsSidebarElements from "./settings-sidebar-elements";
import PropTypes from "prop-types";

const SettingsSidebar = ({ path, setPath }) => {
  const navigate = useNavigate();

  const handleClick = (element) => {
    setPath(element.path);
    navigate(`/settings${element.path}`);
  };

  return (
    <div className="w-full max-w-[300px] overflow-y-auto border-r border-gray-200">
      {settingsSidebarElements.map((element) => {
        return (
          <div
            key={element.title}
            className={`cursor-pointer py-3 text-[0.9rem] ${
              path === element.path
                ? "bg-base-200/10 font-medium text-base-200"
                : "hover:bg-gray-100"
            } `}
            onClick={() => handleClick(element)}
          >
            <p className="ml-6">{element.title}</p>
          </div>
        );
      })}
    </div>
  );
};

SettingsSidebar.propTypes = {
  path: PropTypes.string.isRequired,
  setPath: PropTypes.func.isRequired,
};

export default SettingsSidebar;
