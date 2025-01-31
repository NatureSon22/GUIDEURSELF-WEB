import logo from "../../assets/guideURSelfLOGO 1.png";
import { GoDotFill } from "react-icons/go";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState } from "react";

const LegalSidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [selected, setSelected] = useState(pathname || "/legal/terms");

  return (
    <div className="sticky top-0 flex min-w-[340px] flex-col gap-5 border-r border-secondary-200-60 px-7 pt-14">
      <div className="grid place-items-center px-5">
        <img src={logo} alt={"GuideURSelf logo"} />
      </div>

      <div className="mx-auto space-y-1">
        <div
          className={`flex items-center space-x-1 ${selected === "/legal/terms" ? "text-base-200" : "text-secondary-100-75/50"}`}
        >
          <GoDotFill className="text-xl" />
          <Link
            className="text-[0.95rem]"
            to="/legal/terms"
            onClick={() => setSelected("/legal/terms")}
          >
            Terms of Service
          </Link>
        </div>
        <div className="ml-[8px] w-min bg-secondary-100-75/30 px-[0.1rem] py-3"></div>
        <div
          className={`flex items-center space-x-1 ${selected === "/legal/privacy" ? "text-base-200" : "text-secondary-100-75/50"}`}
        >
          <GoDotFill className="text-xl" />
          <Link
            className="text-[0.95rem]"
            to="/legal/privacy"
            onClick={() => setSelected("/legal/privacy")}
          >
            Privacy and Policy
          </Link>
        </div>
      </div>

      <Button
        className="mt-8 bg-base-200 py-7 text-[1rem]"
        onClick={() => navigate("/login")}
      >
        Login
      </Button>
    </div>
  );
};

export default LegalSidebar;
