import logo from "../assets/guideURSelfLOGO 1.png";
import SideBarElements from "./SideBarElements";
import SideBarTab from "./SideBarTab";

const SideBar = () => {
  return (
    <div className="flex min-w-[290px] flex-col gap-4 border-r border-secondary-200-60 pb-4">
      <div className="grid place-items-center px-5">
        <img src={logo} alt={"GuideURSelf logo"} />
      </div>

      <div className="space-y-2">
        {SideBarElements.map((section) => {
          return (
            <div key={section.sectionTitle}>
              <p className="text-secondary-100-75 mb-1 ml-4 text-[0.8rem]">
                {section.sectionTitle}
              </p>
              <div>
                {section.modules.map((module) => {
                  return <SideBarTab key={module.title} {...module} />;
                })}
              </div>
            </div>
          );
        })}
      </div>

      <button className="mt-auto">Logout</button>
    </div>
  );
};

export default SideBar;
