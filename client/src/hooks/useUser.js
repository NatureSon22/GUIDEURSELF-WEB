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
    const fetchUser = async () => {
      if (data) {
        try {
          //const user = await getUserById(data._id);
          // console.log(user.data.id);
          //setCurrentUser({ ...data, userid: user.data.id });
          setCurrentUser({ ...data });
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    };

    fetchUser();
  }, [data, setCurrentUser]);

  return { isUserLoading };
};

export default useUser;
