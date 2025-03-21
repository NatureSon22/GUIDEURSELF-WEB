import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import useBreadCrumbStore from "@/context/useBreadCrumbStore";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FaBuilding, FaFolder } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { BsGearFill, BsPersonCircle, BsPersonFillAdd } from "react-icons/bs";
import { FaFileAlt } from "react-icons/fa";
import { BiSolidMessage } from "react-icons/bi";
import { IoPerson } from "react-icons/io5";

const icons = {
  Dashboard: <MdDashboard />,
  Documents: <FaFolder />,
  "Virtual Tour": <FaLocationDot />,
  "Key Officials": <BsPersonCircle />,
  Chats: <BiSolidMessage />,
  Campus: <FaBuilding />,
  Accounts: <IoPerson />,
  "Roles Permissions": <BsPersonFillAdd />,
  Reports: <FaFileAlt />,
  Settings: <BsGearFill />,
};

const BreadCrumbNav = () => {
  const crumbs = useBreadCrumbStore((state) => state.crumbs);
  const navigate = useNavigate();

  const handleBreadcrumbClick = (path) => {
    navigate(path, { replace: true });
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, i) => (
          <Fragment key={i}>
            <BreadcrumbItem>
              <div
                className={`flex items-center gap-2 ${i == 0 ? "text-base-200" : ""}`}
              >
                {i == 0 && (
                  <span className="text-[1.1rem]">{icons[crumb.label]}</span>
                )}

                <span
                  className={
                    i == crumbs.length - 1
                      ? "font-medium"
                      : "cursor-pointer font-medium"
                  }
                  // onClick={
                  //   i == crumbs.length - 1
                  //     ? () => {}
                  //     : () => handleBreadcrumbClick(crumb.path)
                  // }
                >
                  {crumb.label}
                </span>
              </div>
            </BreadcrumbItem>

            {i < crumbs.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumbNav;
