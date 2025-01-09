import useAuthStore from "@/context/useAuthStore";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import useUser from "@/hooks/useUser";

const AuthLayer = ({ children }) => {
  const { isAuthenticatedLoading } = useAuth();
  const { isUserLoading } = useUser();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticatedLoading || isUserLoading) {
    return (
      <div className="grid min-h-screen place-items-center"> Loading... </div>
    );
  }

  if (isAuthenticated === false) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

AuthLayer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthLayer;
