import { Outlet } from "react-router-dom";
import LegalSidebar from "./LegalSidebar";

const LegalContainer = () => {
  return (
    <div className="flex min-h-screen">
      <LegalSidebar />
      <div className="h-screen flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default LegalContainer;
