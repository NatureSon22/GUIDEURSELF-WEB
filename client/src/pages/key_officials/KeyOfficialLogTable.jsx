import { useQuery } from '@tanstack/react-query';
import formatDateTime from "@/utils/formatDateTime";
import { Skeleton } from "@/components/ui/skeleton";

const fetchKeyOfficialLogs = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/keyofficiallogs`, {
    method: "GET",
    credentials: "include",
  }); 
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const KeyOfficialLogTable = () => {
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ['keyOfficialLogs'], 
    queryFn: fetchKeyOfficialLogs,
  });

    if (isLoading) {
      return <Skeleton className="rounded-md bg-secondary-200/40 py-24" />;
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
            <th className="p-2 border text-[0.875rem] font-medium text-base-300">Official Name</th>
            <th className="p-2 border text-[0.875rem] font-medium text-base-300">Date And Time Modified</th>
            <th className="p-2 border text-[0.875rem] font-medium text-base-300">Updated By</th>
            <th className="p-2 border text-[0.875rem] font-medium text-base-300">Activity</th>
          </tr>
        </thead>
        <tbody>
          {latestLogs.map((log) => (
            <tr key={log._id}>
              <td className="p-4 border-y text-[0.9rem]">{log.name}</td>
              <td className="p-4 border-y text-[0.9rem]">{formatDateTime(log.date_added)}</td>
              <td className="p-4 border-y text-[0.9rem]">{log.updated_by}</td>
              <td className="p-4 border-y text-[0.9rem]">{log.activity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KeyOfficialLogTable;
