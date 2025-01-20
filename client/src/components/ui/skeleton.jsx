import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    (<div
      className={cn("animate-pulse rounded-md bg-secondary-200/30", className)}
      {...props} />)
  );
}

export { Skeleton }
