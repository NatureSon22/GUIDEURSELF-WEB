import { useQuery } from '@tanstack/react-query';
import formatDateTime from "@/utils/formatDateTime";
import useToggleTheme from "@/context/useToggleTheme";

const CampusLogs = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/campuslogs`, {
    method: "GET",
    credentials: "include",
  }); 
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const CampusLogTable = () => {
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ['campusLogs'], 
    queryFn: CampusLogs,
  });

    const { isDarkMode } = useToggleTheme((state) => state);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  // Sort logs by date (newest first) and take only the latest 8
  const latestLogs = [...data]
    .sort((a, b) => new Date(b.date_added) - new Date(a.date_added))
    .slice(0, 8);

  return (
    <div className="mt-4">
      <table className="w-full text-left border-collapse border-y border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className={` ${isDarkMode ? "bg-dark-secondary-200 border-dark-text-base-300-75/60 text-dark-text-base-300" : "bg-secondary-400"} p-2 border text-[0.875rem] font-medium text-base-300`}>Campus Name</th>
            <th className={` ${isDarkMode ? "bg-dark-secondary-200 border-dark-text-base-300-75/60 text-dark-text-base-300" : "bg-secondary-400"} p-2 border text-[0.875rem] font-medium text-base-300`}>Date And Time Modified</th>
            <th className={` ${isDarkMode ? "bg-dark-secondary-200 border-dark-text-base-300-75/60 text-dark-text-base-300" : "bg-secondary-400"} p-2 border text-[0.875rem] font-medium text-base-300`}>Updated By</th>
            <th className={` ${isDarkMode ? "bg-dark-secondary-200 border-dark-text-base-300-75/60 text-dark-text-base-300" : "bg-secondary-400"} p-2 border text-[0.875rem] font-medium text-base-300`}>Activity</th>
          </tr>
        </thead>
        <tbody>
          {latestLogs.map((log) => (
            <tr key={log._id}>
              <td className={` ${isDarkMode ? " border-dark-text-base-300-75/60 text-dark-text-base-300" : "bg-secondary-400"} p-4 border-y text-[0.9rem]`}>{log.campus_name}</td>
              <td className={` ${isDarkMode ? " border-dark-text-base-300-75/60 text-dark-text-base-300" : "bg-secondary-400"} p-4 border-y text-[0.9rem]`}>{formatDateTime(log.date_added)}</td>
              <td className={` ${isDarkMode ? " border-dark-text-base-300-75/60 text-dark-text-base-300" : "bg-secondary-400"} p-4 border-y text-[0.9rem]`}>{log.updated_by}</td>
              <td className={` ${isDarkMode ? " border-dark-text-base-300-75/60 text-dark-text-base-300" : "bg-secondary-400"} p-4 border-y text-[0.9rem]`}>{log.activity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CampusLogTable;
