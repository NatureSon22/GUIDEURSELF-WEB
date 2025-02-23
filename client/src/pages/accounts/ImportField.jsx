import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { MdCloudUpload } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import readExcelFile from "@/utils/readExcelFile";
import columns from "@/components/columns/FileData";
import DataTable from "@/components/DataTable";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { LuDownload } from "react-icons/lu";

const ImportField = ({ setImportedUsers }) => {
  const inputRef = useRef(null);
  const [error, setError] = useState("");
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState([]);

  const { mutateAsync: handleReadFile } = useMutation({
    mutationFn: (file) => readExcelFile(file),
    onSuccess: (data) => {
      setData(data);
      setImportedUsers(data);
      setError("");
    },
    onError: (error) => {
      setError(error.message);
      setData([]);
      setImportedUsers([]);
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleReadFile(file);
    }
  };

  const handleFileUpload = () => {
    inputRef.current.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleReadFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const templateDownload = () => {
    const link = document.createElement("a");
    link.href = "https://ucarecdn.com/fdfe464a-b478-40fd-8947-bc11b08e33aa/";
    link.download = "template.xlsx";
    link.click();
  };

  return (
    <div className="space-y-4 overflow-y-auto">
      <div className="flex items-end justify-between">
        <div className="space-y-[2px]">
          <p className="font-secondary-100 font-medium">File Upload</p>
          <p className="text-[0.88rem]">
            Click to upload a file or drag and drop. Accepted formats: XLSX, CSV, TSV. Max size: 10MB.
          </p>
        </div>

        <Button
          type="button"
          className="border border-base-200 bg-base-200/10 text-base-200 shadow-none hover:bg-base-200 hover:text-white"
          onClick={templateDownload}
        >
          <LuDownload />
          Download Template
        </Button>
      </div>

      <div className="space-y-3">
        {error && <p className="text-[0.9rem] text-destructive">{error}</p>}
        <Input ref={inputRef} type="file" className="hidden" onChange={handleFileChange} />
        <div
          onClick={handleFileUpload}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="grid w-full cursor-pointer place-items-center rounded-lg border-[4px] border-dashed bg-white py-32"
        >
          <div className="grid place-items-center gap-1 text-secondary-100/50">
            <MdCloudUpload className="text-[2.8rem]" />
            <p className="text-[0.95rem]">Upload a file or drag and drop</p>
          </div>
        </div>
        <p className="text-[0.85rem] text-secondary-100-75">
          Note: Ensure the document meets size and format requirements before uploading.
        </p>
      </div>

      <DataTable
        data={data}
        columns={columns}
        pageSize={20}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        filters={filters}
        setFilters={setFilters}
        showFooter={data.length > 0}
      />
    </div>
  );
};

ImportField.propTypes = {
  setImportedUsers: PropTypes.func.isRequired,
};

export default ImportField;