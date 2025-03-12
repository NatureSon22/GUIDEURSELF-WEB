import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import PageLayout from "./pages/PageLayout";
import { Toaster } from "./components/ui/toaster";
import { useEffect, useRef } from "react";
import { recordTrend } from "./api/trend";
import { createSession } from "./api/session";

const App = () => {
  const hasRun = useRef(false); 
  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;

      const handleRecordTrend = async () => {
        await recordTrend();
        await createSession();
      };

      handleRecordTrend();
    }
  }, []); 

  return (
    <div className="flex h-screen overflow-hidden">
      <SideBar />
      <div className="flex flex-1 flex-col">
        <NavBar />
        <Toaster />
        <PageLayout>
          <Outlet />
        </PageLayout>
      </div>
    </div>
  );
};

export default App;
