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

const Roles = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const { data: accountRoles, isLoading } = useQuery({
    queryKey: ["accountRoles"],
    queryFn: getAllAccounts,
  });
  const navigate = useNavigate();

  const handleAssignRoleClick = () => {};

  return (
    <div className="flex h-full flex-col gap-5">
      <Header
        title="Assign Role"
        subtitle="Manage roles and permissions by selecting staff members and defining their access levels"
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
        <ComboBox options={[]} placeholder="select role" />
        <ComboBox options={[]} placeholder="select status" />
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <DataTable
          data={accountRoles}
          columns={columns}
          filters={[]}
          setFilters={() => {}}
          globalFilter={""}
          setGlobalFilter={() => {}}
          columnActions={{ navigate }}
        />
      )}
    </div>
  );
};

export default Roles;
