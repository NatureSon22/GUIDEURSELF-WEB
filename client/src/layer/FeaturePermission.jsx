import useUserStore from "@/context/useUserStore";
import PropTypes from "prop-types";

const FeaturePermission = ({ module, access, children }) => {
  const { currentUser } = useUserStore((state) => state);

  const hasAccess = currentUser?.permissions?.some((permission) => {
    return (
      permission.module.toLowerCase() === module.toLowerCase() &&
      permission.access?.includes(access.toLowerCase())
    );
  });

  if (!hasAccess) return <></>;

  return children;
};

FeaturePermission.propTypes = {
  module: PropTypes.string.isRequired,
  access: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default FeaturePermission;
