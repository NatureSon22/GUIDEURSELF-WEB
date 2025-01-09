import { Skeleton } from "@/components/ui/skeleton";

const PermissionSkeleton = () => {
  return (
    <div className="w-full border border-secondary-200/30 bg-white px-5 py-6">
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
