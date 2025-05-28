import useToggleTheme from "@/context/useToggleTheme";
import PropTypes from "prop-types";

const Header = ({ title, subtitle }) => {
  const { isDarkMode } = useToggleTheme((state) => state);

  return (
    <div>
      <p
        className={`text-[1.3rem] font-semibold ${isDarkMode ? "text-dark-text-base-300" : ""} `}
      >
        {title}
      </p>
      <p
        className={`text-[0.95rem] ${isDarkMode ? "text-dark-text-base-300-75" : "text-secondary-100/60"} `}
      >
        {subtitle}
      </p>
    </div>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
};

export default Header;
