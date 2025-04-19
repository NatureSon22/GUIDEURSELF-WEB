import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import ComboBox from "@/components/ComboBox";
import { useQuery } from "@tanstack/react-query";
import { getAllAccounts } from "@/api/accounts";
import DataTable from "@/components/DataTable";
import columns from "@/components/columns/RolesPermissions";
import { useNavigate } from "react-router-dom";
import Loading from "@/components/Loading";
import { getAllCampuses, getAllRoleTypes } from "@/api/component-info";
import { GrPowerReset } from "react-icons/gr";
import MultiCampus from "@/layer/MultiCampus";

const Roles = () => {
  const [filters, setFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [reset, setReset] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const { data: allCampuses } = useQuery({
    queryKey: ["allCampuses"],
    queryFn: getAllCampuses,
  });
  const { data: accountRoles, isLoading } = useQuery({
    queryKey: ["accountRoles"],
    queryFn: () => getAllAccounts("", [], true),
  });
  const { data: allRoles } = useQuery({
    queryKey: ["allRoles"],
    queryFn: () => getAllRoleTypes([], true),
  });

  const navigate = useNavigate();

  const filteredAccounts = useMemo(() => {
    if (!accountRoles) return [];

    return accountRoles.filter((account) => {
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
  }, [accountRoles, filters, fromDate, toDate]);

  // const handleAssignRoleClick = () => {
  //   navigate("/roles-permissions/assign-role");
  // };

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
        title="User Permissions"
        subtitle="Assign permissions to users by selecting their user type, campus, and designation, and customize their access to match their responsibilities"
      />

      <div className="flex items-center gap-5">
        <Input
          type="text"
          placeholder="Search"
          value={globalFilter || ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />

        {/* <div className="flex items-center gap-2">
          <FeaturePermission module="Manage Roles and Permissions" access="assign role" >
            <Button
              variant="outline"
              className="text-secondary-100-75"
              onClick={handleAssignRoleClick}
            >
              <BsPersonFillAdd />
              Assign Role
            </Button>
          </FeaturePermission>
        </div> */}
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

        <MultiCampus>
          <ComboBox
            options={allCampuses || []}
            placeholder="select campus"
            filter="campus_name"
            setFilters={setFilters}
            reset={reset}
          />
        </MultiCampus>

        <ComboBox
          options={allRoles}
          placeholder="select user type"
          filter="role_type"
          setFilters={setFilters}
          reset={reset}
        />

        {/* <ComboBox
          options={allStatus}
          placeholder="select status"
          filter="status"
          setFilters={setFilters}
          reset={reset}
        /> */}

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
          columnActions={{ navigate }}
        />
      )}
    </div>
  );
};

export default Roles;
