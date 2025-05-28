import DataTable from "@/components/DataTable";
import Accounts from "@/components/columns/Accounts";
import { useQuery } from "@tanstack/react-query";
import { getAllAccounts } from "@/api/accounts";
import Loading from "@/components/Loading";
import useToggleTheme from "@/context/useToggleTheme";

const RecentAccounts = () => {
  const {
    data: allAccounts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["recent-accounts"],
    queryFn: () => getAllAccounts(10),
    refetchOnWindowFocus: false,
  });
  const { isDarkMode } = useToggleTheme((state) => state);

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
      data={allAccounts || []}
      columns={Accounts}
      columnActions={{ hasAction: false, isDarkMode }}
      showFooter={false}
    />
  );
};

export default RecentAccounts;
