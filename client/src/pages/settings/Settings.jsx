import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SettingsSidebar from "./SettingsSidebar";
import { useEffect, useState } from "react";
import useUserStore from "@/context/useUserStore";
import sidebarElements from "./settings-sidebar-elements";

const Settings = () => {
  const { currentUser } = useUserStore((state) => state);
  const { pathname } = useLocation();
  const location = pathname.split("/")[2];
  const navigate = useNavigate();

  const settingsModule = currentUser?.permissions.find(
    (module) => module.module === "Manage System Settings",
  );

  const firstAccess = settingsModule?.access[0];
  const firstAccessPath = sidebarElements.find(
    (item) => item.access === firstAccess,
  );

  const [path, setPath] = useState("/general-settings"); // default fallback

  useEffect(() => {
    if (!location && firstAccessPath?.path) {
      navigate(`/settings${firstAccessPath.path}`, { replace: true });
    }
  }, [location, firstAccessPath, navigate]);

  // Sync sidebar path with current location
  useEffect(() => {
    const currentPath = `/${location}`;
    console.log("currentPath: " + currentPath);
    setPath(currentPath);
  }, [location]);

  return (
    <div className="flex h-full gap-5 overflow-hidden">
      <SettingsSidebar path={path} setPath={setPath} />
      <div className="h-full flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Settings;
