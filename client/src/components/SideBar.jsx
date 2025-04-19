import logo from "../assets/guideURSelfLOGO 1.png";
import SideBarElements from "./SideBarElements";
import SideBarTab from "./SideBarTab";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import ModulePermission from "@/layer/ModulePermission";
import useUserStore from "@/context/useUserStore";
import { getGeneralData } from "@/api/component-info";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import useBreadCrumbStore from "@/context/useBreadCrumbStore";

const sideBarAccessPath = {
  "Manage Dashboard": "/dashboard",
  "Manage Documents": "/documents", 
  "Manage Virtual Tour": "/virtual-tour",
  "Manage Chats": "/chats",
  "Manage Campus": "/campus",
  "Manage Accounts": "/accounts",
  "Manage Permissions": "/user-permissions",
  "Manage Reports": "/reports",
  "Manage System Settings": "/settings",
};

const SideBar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const currentUser = useUserStore((state) => state.currentUser);
  const { setPath } = useBreadCrumbStore();

  // Initialize chosen state with the current path
  const [chosen, setChosen] = useState("/dashboard");

  const firstAccessibleModule = useMemo(() => {
    return currentUser?.permissions?.[0];
  }, [currentUser?.permissions]);

  const {
    data: general,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["logo"],
    queryFn: getGeneralData,
  });

  // Handle initial navigation based on permissions
  useEffect(() => {
    // Extract the base path from the current URL pathname
    const basePath = `/${pathname.split("/")[1]}`;

    // Check if the current path is valid
    const isValidPath = basePath !== "/";

    // If we have a valid path, use it
    if (isValidPath) {
      setChosen(basePath);
      return;
    }

    // Fall back to the first accessible module path if no valid path
    if (firstAccessibleModule?.module) {
      const fallbackPath = sideBarAccessPath[firstAccessibleModule.module];
      if (fallbackPath) {
        setChosen(fallbackPath);
        navigate(fallbackPath, { replace: true });
      }
    } else {
      // Default fallback if no permissions are available
      setChosen("/dashboard");
      navigate("/dashboard", { replace: true });
    }
  }, [pathname, firstAccessibleModule, navigate]);

  // Update breadcrumbs whenever pathname changes
  useEffect(() => {
    const paths = pathname.split("/").filter(Boolean);
    const filteredPaths = paths.filter((path) => path !== "view");

    const processedPath = filteredPaths.map((path, index) => {
      const fullPath = `/${filteredPaths.slice(0, index + 1).join("/")}`;
      return {
        label: path
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        path: fullPath,
      };
    });

    setPath(processedPath);
  }, [pathname, setPath]);

  // Optimize permission check with useMemo
  const accessibleSections = useMemo(() => {
    return SideBarElements.filter((section) => {
      return section.modules.some((module) =>
        currentUser?.permissions?.some(
          (permission) =>
            permission.module.toLowerCase() === module.module.toLowerCase(),
        ),
      );
    });
  }, [currentUser?.permissions]);

  return (
    <div className="sticky top-0 flex min-w-[300px] flex-col gap-4 border-r border-secondary-200-60 pb-5">
      <div className="grid place-items-center px-5">
        {isLoading ? (
          <Skeleton className="mt-5 w-full rounded-md py-10"></Skeleton>
        ) : isError ? (
          <img src={logo} alt="GuideURSelf logo" />
        ) : (
          <img
            className="h-[135px] object-cover"
            src={general.general_logo_url}
            alt="GuideURSelf logo"
          />
        )}
      </div>

      <div className="space-y-2">
        {accessibleSections.map((section) => (
          <div key={section.sectionTitle}>
            <p className="mb-1 ml-4 text-[0.8rem] text-secondary-100-75">
              {section.sectionTitle}
            </p>

            <div>
              {section.modules.map((module) => (
                <ModulePermission
                  key={module.title}
                  required={{
                    module: module.module,
                  }}
                >
                  <SideBarTab
                    {...module}
                    setSchosen={setChosen}
                    chosen={chosen}
                  />
                </ModulePermission>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
