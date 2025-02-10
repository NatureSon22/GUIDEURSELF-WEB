import Header from "@/components/Header";
import ComboBox from "@/components/ComboBox";
import DateRangePicker from "@/components/DateRangePicker";
import { useState } from "react";
import { getAllAccounts } from "@/api/accounts";
import { getAllCampuses, getAllRoleTypes } from "@/api/component-info";
import { useQuery } from "@tanstack/react-query";
import accountStatus from "@/utils/accountStatus";
import { Button } from "@/components/ui/button";
import { GrPowerReset } from "react-icons/gr";
import DataTable from "@/components/DataTable";
import columns from "@/components/columns/UserReport";
import Loading from "@/components/Loading";
import { LuDownload } from "react-icons/lu";
import jsPDF from "jspdf";
import "jspdf-autotable"; // For table formatting

const AccountReports = () => {
  const [filters, setFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [reset, setReset] = useState(false);

  const { data: allAccounts, isLoading } = useQuery({
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

  const handleReset = () => {
    setFilters([]);
    setGlobalFilter("");
    setReset(!reset);
  };

  // Function to generate PDF
  const handleGeneratePDF = () => {
    if (!allAccounts || allAccounts.length === 0) {
      alert("No data available to generate PDF.");
      return;
    }

    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("User Account Report", 14, 22);

    // Extract table data
    const tableData = allAccounts.map((account) => [
      account.id,
      account.name,
      account.email,
      account.role_type,
      account.campus_name,
      account.status,
    ]);

    // Add table using autoTable plugin
    doc.autoTable({
      head: [["ID", "Name", "Email", "Role", "Campus", "Status"]], // Table headers
      body: tableData, // Table data
      startY: 30, // Start table below the title
    });

    // Save the PDF
    doc.save("user_account_report.pdf");
  };

  return (
    <div className={`flex flex-1 flex-col gap-5`}>
      <Header
        title={"User Account Report"}
        subtitle={
          "Access, review, and generate reports on user account records"
        }
      />

      <div className="flex items-center gap-5">
        <p>Filters:</p>
        <DateRangePicker />
        <ComboBox
          options={allRoles}
          placeholder="select user type"
          filter="role_type"
          setFilters={setFilters}
          reset={reset}
        />
        <ComboBox
          options={allCampuses}
          placeholder="select campus"
          filter="campus_name"
          setFilters={setFilters}
          reset={reset}
        />
        <ComboBox
          options={accountStatus}
          placeholder="select status"
          filter="status"
          setFilters={setFilters}
          reset={reset}
        />

        <Button
          className="text-secondary-100-75"
          variant="outline"
          onClick={handleReset}
        >
          <GrPowerReset /> Reset Filters
        </Button>

        <div className="ml-auto space-x-5">
          <Button variant="ghost" className="text-base-200">
            File Preview
          </Button>
          <Button
            className="border border-base-200 bg-base-200/10 text-base-200 shadow-none hover:bg-base-200 hover:text-white"
            onClick={handleGeneratePDF} // Attach PDF generation function
          >
            <LuDownload />
            Download
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <DataTable
          data={allAccounts}
          columns={columns}
          filters={filters}
          setFilters={setFilters}
          pageSize={11}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          columnActions={{}}
        />
      )}
    </div>
  );
};

export default AccountReports;