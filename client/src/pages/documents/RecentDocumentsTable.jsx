import Header from "@/components/Header";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import DataTable from "@/components/DataTable";
import columns from "@/components/columns/RecentDocuments";
import { useQuery } from "@tanstack/react-query";
import { getAllDocuments } from "@/api/documents";
import Loading from "@/components/Loading";

const RecentDocumentsTable = () => {
  const [filters, setFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState();
  const { data: documents, isLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: () => getAllDocuments("", "", false, true),
  });

  return (
    <div className="mt-6 flex flex-1 flex-col gap-4">
      <Header
        title="Recent Documents"
        subtitle="This section lists the most recent documents uploaded to the system. You can review, edit, or manage these files to ensure they are properly prepared for use."
      />

      <Input
        type="text"
        placeholder="Search"
        value={globalFilter || ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
      />

      <div className={`grid flex-1 ${isLoading ? "place-items-center" : ""} `}>
        {isLoading ? (
          <Loading />
        ) : (
          <DataTable
            data={documents}
            columns={columns}
            filters={filters}
            setFilters={setFilters}
            columnActions={{}}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            pageSize={5}
            showFooter={false}
          />
        )}
      </div>
    </div>
  );
};

export default RecentDocumentsTable;
