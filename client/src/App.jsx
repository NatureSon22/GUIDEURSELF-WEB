import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";

const App = () => {
  return (
    <div className="flex min-h-screen">
      <SideBar />

      <div className="flex-1">
        <NavBar />
        <Outlet />
      </div>
    </div>
  );
};

export default App;
