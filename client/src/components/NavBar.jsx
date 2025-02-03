import { useQuery } from "@tanstack/react-query";
import { loggedInUser } from "@/api/auth";
import { Skeleton } from "./ui/skeleton";
import formatTitle from "@/utils/formatTitle";
import ProfileTab from "./ProfileTab";

const NavBar = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: loggedInUser,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="sticky top-0 flex border-b border-secondary-200-60 px-7 py-2">
      <ProfileTab />

      {isLoading ? (
        <Skeleton className="ml-auto w-[140px] py-6"></Skeleton>
      ) : (
        <ProfileTab>
          <div className="ml-auto flex cursor-pointer items-center gap-3 rounded-md border border-secondary-200/40 px-4 py-1">
            <div className="size-10 rounded-full">
              <img
                src={data.user_photo_url}
                alt=""
                className="h-full w-full rounded-full object-cover"
              />
            </div>

            <div className="flex flex-col">
              <p className="text-[0.9rem] font-medium">{data.username}</p>
              <p className="text-[0.72rem]">{formatTitle(data.role_type)}</p>
            </div>
          </div>
        </ProfileTab>
      )}
    </div>
  );
};

export default NavBar;
