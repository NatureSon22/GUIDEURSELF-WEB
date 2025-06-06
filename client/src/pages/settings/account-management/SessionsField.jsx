import { getSessions } from "@/api/session";
import Layout from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import SessionDisplay from "./SessionDisplay";
import { Skeleton } from "@/components/ui/skeleton";
import useToggleTheme from "@/context/useToggleTheme";

const SessionsField = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["sessions"],
    queryFn: getSessions,
  });
  const { isDarkMode } = useToggleTheme((state) => state);

  return (
    <Layout withHeader={false} isEditable={false}>
      {/* Current Active Sessions */}
      <div>
        <p
          className={`text-[0.95rem] font-semibold ${isDarkMode ? "text-dark-text-base-300" : ""} `}
        >
          Current Active Sessions
        </p>
        <p
          className={`text-[0.85rem] ${isDarkMode ? "text-dark-text-base-300-75" : "text-secondary-100/60"}`}
        >
          View and manage all current login sessions
        </p>

        {isLoading ? (
          <Skeleton className="mt-3 h-12 w-full" />
        ) : data.activeSessions.length > 0 ? (
          <div className="mt-3 space-y-3 px-4">
            {data.activeSessions.map((session) => (
              <SessionDisplay key={session._id} session={session} />
            ))}
          </div>
        ) : (
          <p className="mt-3 px-4 text-[0.85rem] text-secondary-100-75/60">
            No inactive sessions
          </p>
        )}
      </div>

      {/* Logout All Other Sessions */}
      <div className="pt-2">
        <p
          className={`text-[0.95rem] font-semibold ${isDarkMode ? "text-dark-text-base-300" : ""} `}
        >
          Logout all other sessions
        </p>
        <p
          className={`text-[0.85rem] ${isDarkMode ? "text-dark-text-base-300-75" : "text-secondary-100/60"} `}
        >
          You&apos;re logged into these devices and aren&apos;t currently using
          them
        </p>

        {isLoading ? (
          <Skeleton className="mt-3 h-12 w-full" />
        ) : data.inactiveSessions.length > 0 ? (
          <div className="mt-3 space-y-3 px-4">
            {data.inactiveSessions.map((session) => (
              <SessionDisplay key={session._id} session={session} />
            ))}
          </div>
        ) : (
          <p
            className={`mt-3 px-4 text-[0.85rem] ${isDarkMode ? "text-dark-secondary-100-75" : "text-secondary-100-75/60"} `}
          >
            No inactive sessions
          </p>
        )}
      </div>
    </Layout>
  );
};

export default SessionsField;
