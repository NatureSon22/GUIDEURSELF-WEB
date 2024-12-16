import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const SideBarTab = ({ title, icon, path }) => {
  const navigate = useNavigate();

  function handleClick() {
    navigate(path);
  }

  return (
    <div
      key={title}
      className="flex cursor-pointer items-center gap-5 px-7 py-[0.9rem] text-base-300"
      onClick={handleClick}
    >
      <div className="text-[1.48rem]">{icon}</div>
      <p className="text-[0.94rem]">{title}</p>
    </div>
  );
};

SideBarTab.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  path: PropTypes.string.isRequired,
};

export default SideBarTab;
