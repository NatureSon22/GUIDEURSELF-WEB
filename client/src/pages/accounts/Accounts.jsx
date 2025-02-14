import Header from "@/components/Header";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RiAddLargeFill } from "react-icons/ri";
import { MdUpload } from "react-icons/md";
import DataTable from "@/components/DataTable";
import ComboBox from "@/components/ComboBox";
import columns from "../../components/columns/Accounts";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getAllAccounts, verifyAccount } from "@/api/accounts";
import VerifyAccountDialog from "./VerifyAccountDialog";
import accountStatus from "@/utils/accountStatus";
import { getAllCampuses, getAllRoleTypes } from "@/api/component-info";
import Loading from "@/components/Loading";
import { GrPowerReset } from "react-icons/gr";
import FeaturePermission from "@/layer/FeaturePermission";
import MultiCampus from "@/layer/MultiCampus";

const Accounts = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [filters, setFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [reset, setReset] = useState(false);
  const [fromDate, setFromDate] = useState(""); 
  const [toDate, setToDate] = useState(""); 
  
  const {
    data: allAccounts,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: getAllAccounts,
    refetchOnWindowFocus: false,
  });

  const { data: allCampuses } = useQuery({
    queryKey: ["allCampuses"],
    queryFn: getAllCampuses,
  });

  const { data: allRoles } = useQuery({
    queryKey: ["allRoles"],
    queryFn: getAllRoleTypes,
  });

  const { mutateAsync: handleVerifyAccount, isPending } = useMutation({
    mutationFn: (data) => verifyAccount(data),
    onMutate: () => setOpenDialog(true),
    onSuccess: () => {
      setTimeout(() => {
        setOpenDialog(false);
        refetch();
      }, 1000);
    },
    onError: () => setOpenDialog(false),
  });

  const filteredAccounts = useMemo(() => {
    if (!allAccounts) return [];

    return allAccounts.filter((account) => {
      const matchesFilters = filters.every((filter) => {
        if (filter.value === "") return true;
        const accountValue = account[filter.id];
        return (
          accountValue &&
          accountValue.toLowerCase() === filter.value.toLowerCase()
        );
      });

      const accountDate = new Date(account.date_created);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      const matchesDateRange =
        (!from || accountDate >= from) && (!to || accountDate <= to);

      return matchesFilters && matchesDateRange;
    });
  }, [allAccounts, filters, fromDate, toDate]);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const columnActions = { navigate, handleVerifyAccount };

  const handleReset = () => {
    setFilters([]);
    setGlobalFilter("");
    setReset(!reset);
    setFromDate("");
    setToDate("");
  };

  return (
    <div className={`flex flex-1 flex-col gap-5 ${isLoading ? "h-full" : ""} `}>
      <Header
        title={"Accounts"}
        subtitle={
          "Add a new account by manually entering details, importing a file for bulk account creation, or managing inactive accounts."
        }
      />

      <div className="flex items-center gap-5">
        <Input
          type="text"
          placeholder="Search"
          value={globalFilter || ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />

        <div className="flex items-center gap-2">
          <FeaturePermission module="Manage Accounts" access="add account">
            <Button
              variant="outline"
              className="text-secondary-100-75"
              onClick={() => handleNavigate("/accounts/add-account")}
            >
              <RiAddLargeFill /> Add Account
            </Button>
          </FeaturePermission>

          <FeaturePermission module="Manage Accounts" access="import account">
            <Button
              variant="outline"
              className="text-secondary-100-75"
              onClick={() => handleNavigate("/accounts/import-add-account")}
            >
              <MdUpload />
              Import File
            </Button>
          </FeaturePermission>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <p>Filters:</p>

        <div className="flex gap-2">
          <Input
            type="date"
            className="w-[170px]"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <Input
            type="date"
            className="w-[170px]"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <ComboBox
          options={allRoles}
          placeholder="select user type"
          filter="role_type"
          setFilters={setFilters}
          reset={reset}
        />

        <MultiCampus>
          <ComboBox
            options={allCampuses}
            placeholder="select campus"
            filter="campus_name"
            setFilters={setFilters}
            reset={reset}
          />
        </MultiCampus>

        <ComboBox
          options={accountStatus}
          placeholder="select status"
          filter="status"
          setFilters={setFilters}
          reset={reset}
        />

        <Button
          className="ml-auto text-secondary-100-75"
          variant="outline"
          onClick={handleReset}
        >
          <GrPowerReset /> Reset Filters
        </Button>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <DataTable
          data={filteredAccounts}
          columns={columns}
          filters={filters}
          setFilters={setFilters}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          columnActions={columnActions}
        />
      )}

      <VerifyAccountDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        isPending={isPending}
      />
    </div>
  );
};

export default Accounts;
