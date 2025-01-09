import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SettingsSidebar from "./SettingsSidebar";
import { useEffect, useState } from "react";

const Settings = () => {
  const { pathname } = useLocation();
  const location = pathname.split("/")[2];
  const [path, setPath] = useState(
    location ? `/${location}` : "/general-settings",
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!location) {
      navigate("/settings/general-settings");
    }
  }, []);

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
