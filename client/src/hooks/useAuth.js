import { useQuery } from "@tanstack/react-query";
import { isAuthenticated } from "../api/auth";
import useAuthStore from "../context/useAuthStore";
import { useEffect } from "react";

const useAuth = () => {
  const { isLoading, isSuccess, isError } = useQuery({
    queryKey: ["auth"],
    queryFn: () => isAuthenticated(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);

  // Update authentication state when the query is successful
  useEffect(() => {
    if (isSuccess) {
      setIsAuthenticated(true);
    } else if (isError) {
      setIsAuthenticated(false);
    }
  }, [isSuccess, isError, setIsAuthenticated]);

  return { isLoading };
};

export default useAuth;
