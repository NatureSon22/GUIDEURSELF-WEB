import useUserStore from "@/context/useUserStore";
import PropTypes from "prop-types";

const ModulePermission = ({ required, children }) => {
  const { currentUser } = useUserStore((state) => state);

  if (!currentUser?.permissions) return null;

  const hasPermission = currentUser.permissions.some(({ module, access }) => {
    if (!module || !access) return false;

    const moduleMatches =
      module.toLowerCase() === required.module.toLowerCase();

    const userAccess = new Set(access.map((a) => a.toLowerCase()));
    const requiredAccess = required.access?.map((a) => a.toLowerCase()) || [];

    const accessMatches = requiredAccess.every((action) =>
      userAccess.has(action),
    );

    return moduleMatches && accessMatches;
  });

  return hasPermission ? <>{children}</> : null;
};

ModulePermission.propTypes = {
  required: PropTypes.shape({
    module: PropTypes.string.isRequired,
    access: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  children: PropTypes.node,
};

export default ModulePermission;
