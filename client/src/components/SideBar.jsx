import logo from "../assets/guideURSelfLOGO 1.png";
import SideBarElements from "./SideBarElements";
import SideBarTab from "./SideBarTab";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
  "Manage Roles and Permissions": "/roles-and-permissions",
  "Manage Reports": "/reports",
  "Manage System Settings": "/settings",
};

const SideBar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const location = pathname.split("/")[1];
  const currentUser = useUserStore((state) => state.currentUser);
  const { setPath } = useBreadCrumbStore();

  const firstAccessibleModule = currentUser?.permissions[0];

  // Initialize `chosen` state with either the current location or the first accessible module
  const [chosen, setSchosen] = useState("/dashboard");

  const {
    data: general,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["logo"],
    queryFn: getGeneralData,
  });

  useEffect(() => {
    // Prioritize location from URL if available
    const pathFromLocation = location ? `/${location}` : null;
    const fallbackPath = firstAccessibleModule?.module
      ? sideBarAccessPath[firstAccessibleModule.module]
      : "/dashboard";

    const finalPath = pathFromLocation || fallbackPath;

    if (finalPath) {
      console.log("Setting path to:", finalPath);
      setSchosen(finalPath);
      navigate(finalPath, { replace: true });
    }
  }, [location, firstAccessibleModule]);

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

  const userHasAccess = (modules) => {
    return modules.some((module) =>
      currentUser?.permissions?.some(
        (permission) =>
          permission.module.toLowerCase() === module.module.toLowerCase(),
      ),
    );
  };

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
        {SideBarElements.map((section) => {
          return (
            userHasAccess(section.modules) && (
              <div key={section.sectionTitle}>
                <p className="mb-1 ml-4 text-[0.8rem] text-secondary-100-75">
                  {section.sectionTitle}
                </p>

                <div>
                  {section.modules.map((module) => {
                    return (
                      <ModulePermission
                        key={module.title}
                        required={{
                          module: module.module,
                        }}
                      >
                        <SideBarTab
                          {...module}
                          setSchosen={setSchosen}
                          chosen={chosen}
                        />
                      </ModulePermission>
                    );
                  })}
                </div>
              </div>
            )
          );
        })}
      </div>
    </div>
  );
};

export default SideBar;
