import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import PageLayout from "./pages/PageLayout";
import { Toaster } from "./components/ui/toaster";

const App = () => {
  return (
    <div className="flex min-h-screen">
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
