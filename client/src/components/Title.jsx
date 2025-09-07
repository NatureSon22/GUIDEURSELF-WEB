import PropTypes from "prop-types";
import useToggleTheme from "@/context/useToggleTheme";

const Title = ({ title = "", subtitle = "" }) => {
  const { isDarkMode } = useToggleTheme((state) => state);

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <p
            className={`text-[0.95rem] font-semibold ${
              isDarkMode ? "text-dark text-dark-text-base-300" : ""
            }`}
          >
            {title}
          </p>
          <p
            className={`text-[0.85rem] ${
              isDarkMode
                ? "text-dark-text-base-300-75"
                : "text-secondary-100/60"
            }`}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

Title.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

export default Title;
