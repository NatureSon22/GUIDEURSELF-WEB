import { useQuery } from "@tanstack/react-query";
import { loggedInUser } from "@/api/auth";
import useUserStore from "@/context/useUserStore";
import { useEffect } from "react";

const useUser = () => {
  const { data, isLoading: isUserLoading } = useQuery({
    queryKey: ["user"],
    queryFn: loggedInUser,
  });
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);

  useEffect(() => {
    if (data) {
      setCurrentUser(data);
    }
  }, [data, setCurrentUser]);

  return { isUserLoading };
};

export default useUser;
