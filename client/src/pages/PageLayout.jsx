import useToggleTheme from "@/context/useToggleTheme";
import PropTypes from "prop-types";

const PageLayout = ({ children }) => {
  const { isDarkMode } = useToggleTheme((state) => state);

  return (
    <div
      className={`box-border grid flex-1 overflow-y-auto px-7 py-5 ${isDarkMode ? "bg-dark-base-bg" : "bg-secondary-200/5"} transition-colors duration-150`}
    >
      {children}
    </div>
  );
};

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PageLayout;
