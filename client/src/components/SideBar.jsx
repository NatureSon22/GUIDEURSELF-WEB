import { useMutation } from "@tanstack/react-query";
import logo from "../assets/guideURSelfLOGO 1.png";
import SideBarElements from "./SideBarElements";
import SideBarTab from "./SideBarTab";
import { Button } from "./ui/button";
import { logout } from "@/api/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LuLogOut } from "react-icons/lu";

const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [chosen, setSchosen] = useState("");
  const { mutate: handleLogout } = useMutation({
    mutationFn: async () => {
      await logout();
      navigate("/login", { replace: true });
    },
  });

  useEffect(() => {
    setSchosen(`/${location.pathname.split("/")[1]}`);
  }, []);

  return (
    <div className="sticky top-0 flex min-w-[300px] flex-col gap-4 border-r border-secondary-200-60 pb-5">
      <div className="grid place-items-center px-5">
        <img src={logo} alt={"GuideURSelf logo"} />
      </div>

      <div className="space-y-2">
        {SideBarElements.map((section) => {
          return (
            <div key={section.sectionTitle}>
              <p className="mb-1 ml-4 text-[0.8rem] text-secondary-100-75">
                {section.sectionTitle}
              </p>
              <div>
                {section.modules.map((module) => {
                  return (
                    <SideBarTab
                      key={module.title}
                      {...module}
                      setSchosen={setSchosen}
                      chosen={chosen}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <Button
        className="mx-5 mt-auto bg-accent-100/15 py-6 font-semibold text-accent-100 hover:bg-accent-100 hover:text-white"
        onClick={handleLogout}
      >
        <LuLogOut />
        Logout
      </Button>
    </div>
  );
};

export default SideBar;
