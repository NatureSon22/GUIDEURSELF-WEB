import { useQuery } from "@tanstack/react-query";
import { loggedInUser } from "@/api/auth";
import { Skeleton } from "./ui/skeleton";
import formatTitle from "@/utils/formatTitle";
import ProfileTab from "./ProfileTab";
import BreadCrumbNav from "./BreadCrumbNav";
import ToggleTheme from "./ToggleTheme";
import useToggleTheme from "@/context/useToggleTheme";

const NavBar = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: loggedInUser,
    refetchOnWindowFocus: false,
  });
  const { isDarkMode } = useToggleTheme((state) => state);

  return (
    <div
      className={`sticky top-0 flex items-center border-b border-secondary-200-60 px-7 py-2 ${isDarkMode ? "bg-dark-base-bg" : ""} transition-colors duration-150`}
    >
      <BreadCrumbNav />

      <ProfileTab />

      {isLoading ? (
        <Skeleton className="ml-auto w-[140px] py-6"></Skeleton>
      ) : (
        <div className="ml-auto flex items-center gap-8">
          <ToggleTheme />
          <ProfileTab>
            <div className="flex cursor-pointer items-center gap-3 rounded-md border border-secondary-200/40 px-4 py-1">
              <div className="size-10 rounded-full">
                <img
                  src={data.user_photo_url}
                  alt=""
                  className="h-full w-full rounded-full object-cover"
                />
              </div>

              <div className="flex flex-col">
                <p
                  className={`text-[0.9rem] font-medium ${isDarkMode ? "text-dark-text-base-300" : ""} `}
                >
                  {data.username}
                </p>
                <p
                  className={`text-[0.72rem] ${isDarkMode ? "text-dark-secondary-100-75" : ""} `}
                >
                  {formatTitle(data.role_type)}
                </p>
              </div>
            </div>
          </ProfileTab>
        </div>
      )}
    </div>
  );
};

export default NavBar;
