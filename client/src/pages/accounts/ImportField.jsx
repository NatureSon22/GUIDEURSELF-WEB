import { Input } from "@/components/ui/input";
import { useRef } from "react";
import { MdCloudUpload } from "react-icons/md";

const ImportField = () => {
  const inputRef = useRef(null);

  const handleFileUpload = () => {
    inputRef.current.click();
  };

  return (
    <div className="space-y-4">
      <div>
        <p>File Upload</p>
        <p>
          Click to upload a file. Accepted formats only includes XLSX, CSV and
          TSV. The file should only be a maximum of 5MB.
        </p>
      </div>

      <Input ref={inputRef} type="file" className="hidden" />
      <div
        onClick={handleFileUpload}
        className="grid w-full cursor-pointer place-items-center rounded-lg bg-white py-32 border-[4px] border-dashed"
      >
        <div className="grid place-items-center gap-1 text-secondary-100/50">
          <MdCloudUpload className="text-[3rem]" />
          <p>Upload a file or drag and drop</p>
        </div>
      </div>
    </div>
  );
};

export default ImportField;
