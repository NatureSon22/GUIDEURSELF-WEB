import { getMessages } from "@/api/message";
import DataTable from "@/components/DataTable";
import { useQuery } from "@tanstack/react-query";
import columns from "@/components/columns/MessageReport";
import Loading from "@/components/Loading";

const RecentResponse = () => {
  const {
    data: allMessages,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["messages"],
    queryFn: getMessages,
    refetchOnWindowFocus: false,
  });

  if (isError) {
    return (
      <div className="grid h-52 place-items-center text-secondary-100-75">
        <p>Failed to fetch recent accounts</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid h-52 place-items-center">
        <Loading />
      </div>
    );
  }

  return (
    <DataTable
      data={allMessages} // Use filteredFeedbacks instead of allFeedback
      columns={() => columns({ truncateResponse: true })}
      pageSize={10}
      showFooter={false}
    />
  );
};

export default RecentResponse;
