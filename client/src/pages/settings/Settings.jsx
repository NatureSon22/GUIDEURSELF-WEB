import { Outlet } from "react-router-dom";
import SettingsSidebar from "./SettingsSidebar";
import { useState } from "react";

const Settings = () => {
  const [path, setPath] = useState("");

  return (
    <div className="flex h-full gap-5">
      <SettingsSidebar path={path} setPath={setPath} />

      <div className="h-full flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Settings;
