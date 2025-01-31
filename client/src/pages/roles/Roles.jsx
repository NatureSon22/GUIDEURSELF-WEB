import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { BsPersonFillAdd } from "react-icons/bs";
import ComboBox from "@/components/ComboBox";
import { useQuery } from "@tanstack/react-query";
import { getAllAccounts } from "@/api/accounts";
import DataTable from "@/components/DataTable";
import columns from "@/components/columns/RolesPermissions";
import { useNavigate } from "react-router-dom";
import Loading from "@/components/Loading";
import DateRangePicker from "@/components/DateRangePicker";
import { getAllRoleTypes, getAllStatus } from "@/api/component-info";
import { GrPowerReset } from "react-icons/gr";

const Roles = () => {
  const [filters, setFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [reset, setReset] = useState(false);
  const { data: accountRoles, isLoading } = useQuery({
    queryKey: ["accountRoles"],
    queryFn: getAllAccounts,
  });
  const { data: allStatus } = useQuery({
    queryKey: ["allStatus"],
    queryFn: getAllStatus,
  });
  const { data: allRoles } = useQuery({
    queryKey: ["allRoles"],
    queryFn: getAllRoleTypes,
  });

  const navigate = useNavigate();

  const handleAssignRoleClick = () => {
    navigate("/roles-permissions/assign-role");
  };

  const handleReset = () => {
    setFilters([]);
    setGlobalFilter("");
    setReset(!reset);
  };

  return (
    <div className={`flex flex-1 flex-col gap-5 ${isLoading ? "h-full" : ""} `}>
      <Header
        title="Roles & Permissions"
        subtitle="Manage roles and permissions by selecting a staff member, assigning their campus and designation, defining their role and customizing their access levels within the system based on their responsibilities"
      />

      <div className="flex items-center gap-5">
        <Input
          type="text"
          placeholder="Search"
          value={globalFilter || ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="text-secondary-100-75"
            onClick={handleAssignRoleClick}
          >
            <BsPersonFillAdd />
            Assign Role
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <p>Filters:</p>
        <DateRangePicker />
        <ComboBox
          options={allRoles}
          placeholder="select role"
          filter="role_type"
          setFilters={setFilters}
          reset={reset}
        />

        <ComboBox
          options={allStatus}
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
          data={accountRoles}
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
