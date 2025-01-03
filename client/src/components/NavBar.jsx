import { useQuery } from "@tanstack/react-query";
import { loggedInUser } from "@/api/auth";
import { Skeleton } from "./ui/skeleton";
const NavBar = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: loggedInUser,
  });

  return (
    <div className="sticky top-0 flex border-b border-secondary-200-60 px-7 py-2">
      {isLoading ? (
        <Skeleton className="ml-auto w-[140px] animate-pulse rounded-md bg-secondary-200/40 py-6"></Skeleton>
      ) : (
        <div className="ml-auto flex items-center gap-3 rounded-md border border-secondary-200/50 px-4 py-1">
          <div className="size-10 rounded-full">
            <img
              src={data.user_photo_url}
              alt=""
              className="w-full rounded-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <p className="text-[0.9rem] font-medium">{data.username}</p>
            <p className="text-[0.72rem]">Admin</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
