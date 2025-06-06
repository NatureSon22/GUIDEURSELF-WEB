import { useNavigate } from "react-router-dom";
import settingsSidebarElements from "./settings-sidebar-elements";
import PropTypes from "prop-types";
import FeaturePermission from "@/layer/FeaturePermission";
import useToggleTheme from "@/context/useToggleTheme";

const SettingsSidebar = ({ path, setPath }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useToggleTheme((state) => state);

  const handleClick = (element) => {
    if (!element.children) {
      setPath(element.path);
      navigate(`/settings${element.path}`);
    }
  };

  return (
    <div className="w-full max-w-[300px] overflow-y-auto border-r border-gray-200">
      {settingsSidebarElements.map((element) => (
        <FeaturePermission
          key={element.title}
          module="Manage System Settings"
          access={element.access}
        >
          <div>
            {/* Parent Item */}
            <div
              className={`cursor-pointer py-3 text-[0.9rem] ${
                path === element.path
                  ? "bg-base-200/10 font-medium text-base-200"
                  : isDarkMode
                    ? "text-dark-text-base-300 hover:bg-base-200/10"
                    : "hover:bg-gray-100"
              }`}
              onClick={() => handleClick(element)}
            >
              <p className="ml-6">{element.title}</p>
            </div>

            {/* Always-visible child elements */}
            {element.children && (
              <div className="ml-6 border-l border-gray-300">
                {element.children.map((child) => (
                  <div
                    key={child.title}
                    className={`cursor-pointer py-2 pl-4 text-[0.9rem] ${
                      path === child.path
                        ? isDarkMode
                          ? ""
                          : "bg-base-200/10 font-medium text-base-200"
                        : isDarkMode
                          ? "text-dark-text-base-300 hover:bg-base-200/10"
                          : "hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setPath(child.path);
                      navigate(`/settings${child.path}`);
                    }}
                  >
                    {child.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        </FeaturePermission>
      ))}
    </div>
  );
};

SettingsSidebar.propTypes = {
  path: PropTypes.string.isRequired,
  setPath: PropTypes.func.isRequired,
};

export default SettingsSidebar;
