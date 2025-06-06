import { logout } from "@/api/auth";
import { logoutSession } from "@/api/session";
import { Button } from "@/components/ui/button";
import useToggleTheme from "@/context/useToggleTheme";
import { useToast } from "@/hooks/use-toast";
import formatDate from "@/utils/formatDate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { MdDevices } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const SessionDisplay = ({ session }) => {
  const client = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { _id, userAgent, isActive, lastActive, device } = session;
  const { isDarkMode } = useToggleTheme((state) => state);
  const { mutate: handleLogout, isLoading } = useMutation({
    mutationFn: () => logoutSession(_id),
    onSuccess: () => {
      toast({ title: "Logout successful", description: "Session logged out" });
      client.invalidateQueries({ queryKey: ["sessions"] });

      setTimeout(async () => {
        if (device === "web") {
          await logout();
          navigate("/login", { replace: true });
        }
      }, 1500);
    },
    onError: () =>
      toast({
        title: "Logout failed",
        variant: "destructive",
        description: "Session not logged out",
      }),
  });

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="grid size-10 place-items-center rounded-full border bg-white">
          <MdDevices className="text-xl text-base-200" />
        </div>

        <div className="space-y-[0.2rem]">
          <p
            className={`text-[0.82rem] ${isDarkMode ? "text-dark-text-base-300-75" : ""} `}
          >
            OS: {userAgent.os.name} {userAgent.os.version}
          </p>
          {isActive ? (
            <p className="w-max rounded-xl bg-base-200 px-3 py-1 text-[0.65rem] text-white">
              Active Now
            </p>
          ) : (
            <p className="text-[0.7rem] text-secondary-100-75">
              Last Active: {formatDate(lastActive)}
            </p>
          )}
        </div>
      </div>

      {isActive && (
        <Button
          variant="destructive"
          className="h-8 text-[0.7rem]"
          disabled={isLoading}
          onClick={handleLogout}
        >
          {isLoading ? "Logging out..." : "Logout"}
        </Button>
      )}
    </div>
  );
};

SessionDisplay.propTypes = {
  session: PropTypes.shape({
    _id: PropTypes.string,
    userAgent: PropTypes.shape({
      os: PropTypes.shape({
        name: PropTypes.string,
        version: PropTypes.string,
      }),
    }),
    isActive: PropTypes.bool,
    lastActive: PropTypes.string,
    device: PropTypes.string,
  }),
};

export default SessionDisplay;
