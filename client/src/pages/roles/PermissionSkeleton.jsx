import { Skeleton } from "@/components/ui/skeleton";
import useToggleTheme from "@/context/useToggleTheme";

const PermissionSkeleton = () => {
  const { isDarkMode } = useToggleTheme((state) => state);
  return (
    <div
      className={`w-full border px-5 py-6 ${isDarkMode ? "border-dark-secondary-100-75/40 bg-dark-base-bg" : "border-secondary-200/30 bg-white"} transition-colors duration-150`}
    >
      <Skeleton className="w-full max-w-[270px] py-3"></Skeleton>
      <Skeleton className="mt-2 w-full max-w-[600px] py-2"></Skeleton>

      <div className="mt-7 flex flex-wrap gap-8">
        <Skeleton className="w-min px-20 py-5"></Skeleton>
        <Skeleton className="w-min px-20 py-5"></Skeleton>
        <Skeleton className="w-min px-20 py-5"></Skeleton>
        <Skeleton className="w-min px-20 py-5"></Skeleton>
        <Skeleton className="w-min px-20 py-5"></Skeleton>
      </div>
    </div>
  );
};

export default PermissionSkeleton;
