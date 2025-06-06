import * as React from "react";

import { cn } from "@/lib/utils";
import useToggleTheme from "@/context/useToggleTheme";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  const { isDarkMode } = useToggleTheme((state) => state);

  return (
    <input
      type={type}
      className={cn(
        `flex h-9 w-full rounded-md border bg-transparent px-3 py-3 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${isDarkMode ? "border-dark-secondary-100-75 text-dark-text-base-300-75" : "border-input text-base"}`,
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
