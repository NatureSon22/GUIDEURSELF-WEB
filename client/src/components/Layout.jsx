import useToggleTheme from "@/context/useToggleTheme";
import PropTypes from "prop-types";
import { BiEdit } from "react-icons/bi";

const Layout = ({
  title = "",
  subtitle = "",
  toggleEditMode = () => {},
  isEditable = true,
  withHeader = true,
  children,
}) => {
  const { isDarkMode } = useToggleTheme((state) => state);

  return (
    <div className="space-y-4 rounded-lg border border-secondary-200/40 p-4 shadow-sm">
      {withHeader && (
        <div className="flex justify-between">
          <div>
            <p
              className={`text-[0.95rem] font-semibold ${isDarkMode ? "text-dark text-dark-text-base-300" : ""}`}
            >
              {title}
            </p>
            <p
              className={`text-[0.85rem] ${isDarkMode ? "text-dark-text-base-300-75" : "text-secondary-100/60"}`}
            >
              {subtitle}
            </p>
          </div>

          {isEditable && (
            <BiEdit
              className={`cursor-pointer text-[1.4rem] ${isDarkMode ? "text-dark-text-base-300-75" : "text-secondary-100/50"} `}
              onClick={() => toggleEditMode((prev) => !prev)}
            />
          )}
        </div>
      )}

      {children}
    </div>
  );
};

Layout.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  toggleEditMode: PropTypes.func,
  withHeader: PropTypes.bool,
  children: PropTypes.node.isRequired,
  isEditable: PropTypes.bool,
};

export default Layout;
