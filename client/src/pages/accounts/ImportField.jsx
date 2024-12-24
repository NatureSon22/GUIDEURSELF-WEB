import { Input } from "@/components/ui/input";
import { useRef } from "react";
import { MdCloudUpload } from "react-icons/md";

const ImportField = () => {
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const data = reader.result;
      console.log(data);
    };

    reader.readAsText(file);
  };

  const handleFileUpload = () => {
    inputRef.current.click();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-[2px]">
        <p className="font-secondary-100 font-medium">File Upload</p>
        <p className="text-[0.88rem]">
          Click to upload a file. Accepted formats only includes XLSX, CSV and
          TSV. File size should not exceed 10MB
        </p>
      </div>

      <div className="space-y-3">
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
    </div>
  );
};

export default ImportField;
