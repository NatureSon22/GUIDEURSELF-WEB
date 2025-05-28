import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { logout } from "@/api/auth";
import useToggleTheme from "@/context/useToggleTheme";

const ProfileTab = ({ children }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { mutate: handleLogout } = useMutation({
    mutationFn: async () => {
      await logout();
      navigate("/login", { replace: true });
    },
  });
  const { isDarkMode } = useToggleTheme((state) => state);

  const handleNavigate = () => {
    navigate("/settings/account-management");
    setOpen(!open);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        className={`w-[11.5rem] ${isDarkMode ? "bg-dark-base-bg" : ""} `}
      >
        <Button
          className={`w-full text-[0.85rem] text-secondary-100-75 ${isDarkMode ? "text-dark-text-base-300 hover:text-dark-text-base-300 hover:bg-dark-text-base-300/20" : ""}`}
          variant="ghost"
          onClick={handleNavigate}
        >
          Manage Account
        </Button>
        <Button
          className={`w-full bg-accent-100/15 text-[0.85rem] text-accent-100 hover:bg-accent-100 hover:text-white ${isDarkMode ? "bg-accent-100/20 font-semibold" : ""}`}
          variant="ghost"
          onClick={handleLogout}
        >
          Logout Account
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

ProfileTab.propTypes = {
  children: PropTypes.node,
};

export default ProfileTab;
