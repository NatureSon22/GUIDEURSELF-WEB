import { useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { activateAccount, getAllInactiveAccount } from "@/api/accounts";
import { getAllCampuses, getAllRoleTypes } from "@/api/component-info";
import { Button } from "@/components/ui/button";
import ComboBox from "@/components/ComboBox";
import { GrPowerReset } from "react-icons/gr";
import DataTable from "@/components/DataTable";
import columns from "@/components/columns/ArchiveAccounts";
import MultiCampus from "@/layer/MultiCampus";
import { Input } from "@/components/ui/input";
import DialogContainer from "@/components/DialogContainer";
import { FaCircleExclamation } from "react-icons/fa6";

const ArchiveAccount = () => {
  const { toast } = useToast();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState([]);
  const [reset, setReset] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const client = useQueryClient();

  const { data: inactiveAccounts } = useQuery({
    queryKey: ["inactive-accounts"],
    queryFn: getAllInactiveAccount,
  });

  const { data: allCampuses } = useQuery({
    queryKey: ["allCampuses"],
    queryFn: getAllCampuses,
  });

  const { data: roleTypes } = useQuery({
    queryKey: ["roleTypes"],
    queryFn: getAllRoleTypes,
  });

  const filteredInactiveAccounts = useMemo(() => {
    if (!inactiveAccounts || inactiveAccounts.length === 0) {
      return [];
    }

    return inactiveAccounts.filter((account) => {
      console.log(inactiveAccounts);
      const matchesFilters = filters.every((filter) => {
        if (filter.value === "") return true;
        const accountValue = filter.id
          .split(".")
          .reduce((obj, key) => obj?.[key], account);
        console.log("accountValue " + accountValue);
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
  }, [inactiveAccounts, filters, fromDate, toDate]);

  const { mutate: handleActivate, isLoading } = useMutation({
    mutationFn: () => activateAccount(selectedAccount),
    onSuccess: () => {
      toast({
        title: "Account Activated",
        description: "Account has been activated successfully",
      });
      client.invalidateQueries(["inactive-accounts"]);
      setOpenDialog(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to activate account",
        variant: "destructive",
      });
    },

    setOpenDialog: () => setOpenDialog(false),
  });

  const handleReset = () => {
    setGlobalFilter("");
    setFilters([]);
    setReset((prev) => !prev);
    setFromDate("");
    setToDate("");
  };

  const handleSelect = (accountId) => {
    setSelectedAccount(accountId);
    setOpenDialog(true);
  };

  return (
    <div className="flex flex-1 flex-col space-y-5">
      <Input
        type="text"
        placeholder="Search"
        value={globalFilter || ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
      />

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

        <MultiCampus>
          <ComboBox
            options={allCampuses || []}
            placeholder="select campus"
            filter="campus_id.campus_name"
            setFilters={setFilters}
            reset={reset}
          />
        </MultiCampus>

        <ComboBox
          options={roleTypes || []}
          placeholder="select role"
          filter="role_id.role_type"
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

      <div className="flex-1">
        <DataTable
          data={filteredInactiveAccounts}
          columns={columns}
          filters={filters}
          setFilters={setFilters}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          columnActions={{ handleSelect }}
        />
      </div>

      <DialogContainer openDialog={openDialog}>
        <div className="flex flex-col items-center gap-5">
          <FaCircleExclamation className="text-[2.5rem] text-base-200" />
          <p className="text-[0.95rem] font-semibold">
            Do you want to activate this account?
          </p>
          <div className="flex w-full gap-4">
            <Button
              variant="outline"
              className="flex-1 border-secondary-200 py-1 text-secondary-100-75"
              onClick={() => setOpenDialog(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 border border-base-200 bg-base-200/10 py-1 text-base-200 shadow-none hover:bg-base-200/10"
              onClick={() => {
                handleActivate(selectedAccount);
                setOpenDialog(false);
              }}
              disabled={isLoading}
            >
              Proceed
            </Button>
          </div>
        </div>
      </DialogContainer>
    </div>
  );
};

export default ArchiveAccount;
