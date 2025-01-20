import PropTypes from "prop-types";

const Header = ({ title, subtitle }) => {
  return (
    <div>
      <p className="text-[1.3rem] font-semibold">{title}</p>
      <p className="text-[0.95rem] text-secondary-100/60">{subtitle}</p>
    </div>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
};

export default Header;
