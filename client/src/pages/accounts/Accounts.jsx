import Header from "@/components/Header";
import { useMemo, useState } from "react";
import { userType, campus, status } from "@/data/filter_types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RiAddLargeFill } from "react-icons/ri";
import { MdUpload } from "react-icons/md";
import DataTable from "@/components/DataTable";
import ComboBox from "@/components/ComboBox";
import data from "../../data/accounts";
import columns from "../../components/columns/Accounts";

const Accounts = () => {
  const userTypes = useMemo(() => userType, []);
  const campuses = useMemo(() => campus, []);
  const statuses = useMemo(() => status, []);
  const [filters, setFilters] = useState({
    username: "",
  });
  const [globalFilter, setGlobalFilter] = useState("");

  return (
    <div className="grid gap-5">
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
          <Button variant="outline" className="text-secondary-100-75">
            <RiAddLargeFill /> Add Account
          </Button>
          <Button variant="outline" className="text-secondary-100-75">
            <MdUpload />
            Import File
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <p>Filters:</p>
        <ComboBox />
        <ComboBox options={userTypes} placeholder="select user type" />
        <ComboBox options={campuses} placeholder="select campus" />
        <ComboBox options={statuses} placeholder="select status" />
        <></>
      </div>

      <DataTable
        data={data}
        columns={columns}
        filters={filters}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
    </div>
  );
};

export default Accounts;
