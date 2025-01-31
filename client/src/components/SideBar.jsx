import logo from "../assets/guideURSelfLOGO 1.png";
import SideBarElements from "./SideBarElements";
import SideBarTab from "./SideBarTab";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ModulePermission from "@/layer/ModulePermission";
import { getGeneralData } from "@/api/component-info";
import {Skeleton} from "@/components/ui/skeleton"
import { useMutation, useQuery } from "@tanstack/react-query";


const SideBar = () => {
  const { pathname } = useLocation();
  const location = pathname.split("/")[1];

  const [chosen, setSchosen] = useState(
    location ? `/${location}` : "/dashboard",
  );

  useEffect(() => {
    if (location) {
      setSchosen(`/${location}`);
    }
  }, [location]);

  const {data:general, isLoading, isError} = useQuery ({
    queryKey: ["logo"],
    queryFn: getGeneralData,
  });

  return (
    <div className="sticky top-0 flex min-w-[300px] flex-col gap-4 border-r border-secondary-200-60 pb-5">
      <div className="grid place-items-center px-5">
      {isLoading ? <Skeleton className="w-full py-10 mt-5 rounded-md"></Skeleton> : isError? <img src={logo}/> : <img className="object-cover h-[135px]" src={general.general_logo_url} alt={"GuideURSelf logo"} />}
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
