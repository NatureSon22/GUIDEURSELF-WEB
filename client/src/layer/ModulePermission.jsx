import useUserStore from "@/context/useUserStore";
import PropTypes from "prop-types";

const ModulePermission = ({ required, children }) => {
  const { currentUser } = useUserStore((state) => state);

  if (!currentUser?.permissions) {
    return null;
  }

  const hasPermission = currentUser.permissions.some((permission) => {
    const matchesModule =
      permission?.module?.toLowerCase() === required?.module?.toLowerCase();

    const matchesAccess =
      !required?.access ||
      required.access.every((action) =>
        permission?.access
          ?.map((a) => a.toLowerCase())
          .includes(action.toLowerCase()),
      );

    return matchesModule && matchesAccess;
  });

  if (!hasPermission && !required?.isPublic) {
    return null;
  }

  return <>{children}</>;
};

ModulePermission.propTypes = {
  required: PropTypes.shape({
    module: PropTypes.string,
    access: PropTypes.arrayOf(PropTypes.string),
    isPublic: PropTypes.bool,
  }),
  children: PropTypes.node,
};

export default ModulePermission;
