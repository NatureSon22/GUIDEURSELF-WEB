import Header from "../../components/Header";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllAccounts } from "../../api/accounts";
import DataTable from "../../components/DataTable";
import columns from "@/components/columns/AssignRole";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import MultiCampus from "@/layer/MultiCampus";
import ComboBox from "@/components/ComboBox";
import { getAllCampuses } from "@/api/component-info";
import { GrPowerReset } from "react-icons/gr";

const AssignRole = () => {
  const [filters, setFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const { data: accountRoles, isLoading } = useQuery({
    queryKey: ["accountRoles"],
    queryFn: () => getAllAccounts("", ["super administrator", "administrator"]),
  });
  const navigate = useNavigate();
  const [rowSelection, setRowSelection] = useState({});
  const [reset, setReset] = useState(false);
  const selectedAccountIds = Object.keys(rowSelection);

  const { data: allCampuses } = useQuery({
    queryKey: ["allCampuses"],
    queryFn: getAllCampuses,
  });

  const handleAssignRoleClick = () => {
    navigate("/roles-permissions/edit-assign-role", {
      state: {
        accountIds: selectedAccountIds,
      },
    });
  };

  const handleReset = () => {
    setReset(!reset);
    setGlobalFilter("");
    setRowSelection({});
  };

  return (
    <div className={`flex flex-1 flex-col gap-5`}>
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

        <Button
          className="bg-base-200"
          onClick={handleAssignRoleClick}
          disabled={Object.keys(rowSelection).length === 0}
        >
          Confirm Selection
          {selectedAccountIds.length > 0 && (
            <span className="font-bold">( {selectedAccountIds.length} )</span>
          )}
        </Button>
      </div>

      <div className="flex justify-between">
        <MultiCampus>
          <ComboBox
            options={allCampuses || []}
            placeholder="select campus"
            filter="campus_name"
            setFilters={setFilters}
            reset={reset}
          />
        </MultiCampus>

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
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          columnActions={{}}
        />
      )}

      {/* <div className="ml-auto space-x-5">
        <Button variant="ghost" onClick={handleCancel}>
          Cancel
        </Button>
        <Button className="bg-base-200" onClick={handleAssignRoleClick} disabled={Object.keys(rowSelection).length === 0} >
          Next
        </Button>
      </div> */}
    </div>
  );
};

export default AssignRole;
