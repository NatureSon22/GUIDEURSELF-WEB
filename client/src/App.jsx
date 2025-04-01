import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import PageLayout from "./pages/PageLayout";
import { Toaster } from "./components/ui/toaster";
import { useEffect } from "react";
import { recordTrend } from "./api/trend";
import { createSession } from "./api/session";

const App = () => {
  useEffect(() => {
    const initApp = async () => {
      try {
        const sessionExists = sessionStorage.getItem("sessionCreated");

        if (!sessionExists) {
          await recordTrend();
          await createSession();
          sessionStorage.setItem("sessionCreated", "true");
        }
      } catch (error) {
        console.error("Error initializing app:", error);
      }
    };

    initApp();
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
