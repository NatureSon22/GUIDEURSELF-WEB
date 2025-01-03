import { Input } from "@/components/ui/input";
import { useRef } from "react";
import { MdCloudUpload } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import readExcelFile from "@/utils/readExcelFile";
import { useState } from "react";
import columns from "@/components/columns/FileData";
import DataTable from "@/components/DataTable";
import PropTypes from "prop-types";

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

  return (
    <div className="space-y-4 overflow-y-auto">
      <div className="space-y-[2px]">
        <p className="font-secondary-100 font-medium">File Upload</p>
        <p className="text-[0.88rem]">
          Click to upload a file. Accepted formats only includes XLSX, CSV and
          TSV. File size should not exceed 10MB
        </p>
      </div>

      <div className="space-y-3">
        {error && <p className="text-[0.9rem] text-destructive">{error}</p>}
        <Input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
        <div
          onClick={handleFileUpload}
          className="grid w-full cursor-pointer place-items-center rounded-lg border-[4px] border-dashed bg-white py-32"
        >
          <div className="grid place-items-center gap-1 text-secondary-100/50">
            <MdCloudUpload className="text-[2.8rem]" />
            <p className="text-[0.95rem]">Upload a file or drag and drop</p>
          </div>
        </div>
        <p className="text-[0.85rem] text-secondary-100-75">
          Note: Ensure the document follows any size and format restrictions
          before uploading. Review all fields before uploading to avoid errors
          or missing information
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
        showFooter={data.length > 0 ? true : false}
      />
    </div>
  );
};

ImportField.propTypes = {
  setImportedUsers: PropTypes.func,
};

export default ImportField;
