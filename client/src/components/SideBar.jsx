import logo from "../assets/guideURSelfLOGO 1.png";
import SideBarElements from "./SideBarElements";
import SideBarTab from "./SideBarTab";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import ModulePermission from "@/layer/ModulePermission";

const SideBar = () => {
  const { pathname } = useLocation();
  const location = pathname.split("/")[1];

  const [chosen, setSchosen] = useState(
    location ? `/${location}` : "/dashboard",
  );

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
                    <ModulePermission
                      key={module.title}
                      required={{
                        module: module.module,
                        isPublic: module.isPublic,
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
          );
        })}
      </div>
    </div>
  );
};

export default SideBar;
