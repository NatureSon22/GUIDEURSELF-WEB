import useUserStore from "@/context/useUserStore";
import PropTypes from "prop-types";

const MultiCampus = ({ children }) => {
  const { currentUser } = useUserStore((state) => state);

  return currentUser?.isMultiCampus ? children : <></>;
};

MultiCampus.propTypes = {
  children: PropTypes.node,
};

export default MultiCampus;
