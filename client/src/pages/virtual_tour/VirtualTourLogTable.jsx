import { useQuery } from '@tanstack/react-query';

const fetchVirtualTourLogs = async () => {
  const response = await fetch("http://localhost:3000/api/virtualtourlog", {
    method: "GET",
    credentials: "include",
  }); 
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const VirtualTourLogTable = () => {
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ['virtualTourLogs'], 
    queryFn: fetchVirtualTourLogs,
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0'); 
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12; 
    return `${day}-${month}-${year} ${hour12}:${minutes} ${ampm}`;
  };

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
      <table className="w-full text-left border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border text-[1rem]">Campus Name</th>
            <th className="p-2 border text-[1rem]">Date Added</th>
            <th className="p-2 border text-[1rem]">Updated By</th>
            <th className="p-2 border text-[1rem]">Activity</th>
          </tr>
        </thead>
        <tbody>
          {latestLogs.map((log) => (
            <tr key={log._id}>
              <td className="p-2 border text-[0.9rem]">{log.campus_name}</td>
              <td className="p-2 border text-[0.9rem]">{formatDate(log.date_added)}</td>
              <td className="p-2 border text-[0.9rem]">{log.updated_by}</td>
              <td className="p-2 border text-[0.9rem]">{log.activity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VirtualTourLogTable;
