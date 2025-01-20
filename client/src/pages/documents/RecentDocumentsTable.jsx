import Header from "@/components/Header";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/DataTable";
import columns from "@/components/columns/RecentDocuments";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllDocuments } from "@/api/documents";
import Loading from "@/components/Loading";

const RecentDocumentsTable = () => {
  const { state } = useLocation();
  const folder_id = state?.folder_id;
  const navigate = useNavigate();
  const [filters, setFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState();
  const { data: documents, isLoading } = useQuery({
    queryKey: ["documents", folder_id],
    queryFn: () => getAllDocuments(folder_id),
  });

  return (
    <div className="mt-6 flex flex-1 flex-col gap-4">
      <Header
        title="Recently Added"
        subtitle="This section lists the most recent documents uploaded to the system. You can review, edit, or manage these files to ensure they are properly prepared for use."
      />

      <div className="flex gap-5">
        <Input
          type="text"
          placeholder="Search"
          value={globalFilter || ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />

        <Button
          variant="outline"
          className="text-secondary-100-75"
          onClick={() => navigate("/documents/all-documents")}
        >
          Show All Documents
        </Button>
      </div>

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
          />
        )}
      </div>
    </div>
  );
};

export default RecentDocumentsTable;
