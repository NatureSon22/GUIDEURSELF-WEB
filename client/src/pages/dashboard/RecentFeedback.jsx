import { getAllFeedback } from "@/api/component-info";
import DataTable from "@/components/DataTable";
import { useQuery } from "@tanstack/react-query";
import columns from "@/components/columns/FeedbackReport";
import Loading from "@/components/Loading";

const RecentFeedback = () => {
  const {
    data: allFeedback,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["feedback"],
    queryFn: getAllFeedback,
  });

  if (isError) {
    return (
      <div className="grid h-52 place-items-center text-secondary-100-75">
        <p>Failed to fetch recent feedback</p>
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
      data={allFeedback} // Use filteredFeedbacks instead of allFeedback
      columns={columns}
      showFooter={false}
    />
  );
};

export default RecentFeedback;
