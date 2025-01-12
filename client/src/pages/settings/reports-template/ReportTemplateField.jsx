import Layout from "@/components/Layout";
import { MdCloudUpload } from "react-icons/md";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postTemplate } from "@/api/template";
import { useToast } from "@/hooks/use-toast";
import { FaFile } from "react-icons/fa";

const ReportTemplateField = () => {
  const inputRef = useRef(null);
  const [fileURLs, setFileUrls] = useState([]);
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const client = useQueryClient();

  const { mutateAsync: handleUpload, isPending } = useMutation({
    mutationFn: postTemplate,
    onSuccess: (data) => {
      client.invalidateQueries(["files"]);
      toast({
        title: "Success",
        description: data.message,
      });
      setFileUrls([]);
      setFiles([]);
      setIsDragging(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const fileArray = Array.from(selectedFiles);
      setFiles((prevFiles) => [...prevFiles, ...fileArray]);
      const fileUrls = fileArray.map((file) => URL.createObjectURL(file));
      setFileUrls((prevUrls) => [...prevUrls, ...fileUrls]);
    }
    setIsDragging(false);
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleUploadClick = () => {
    const formData = new FormData();
    files.forEach((file) => formData.append("template", file));

    handleUpload(formData);
  };

  const handleCancel = () => {
    setFileUrls([]);
    setFiles([]);
  };

  const handleRemoveFile = (file) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles) {
      const fileArray = Array.from(droppedFiles);
      setFiles((prevFiles) => [...prevFiles, ...fileArray]);
      const fileUrls = fileArray.map((file) => URL.createObjectURL(file));
      setFileUrls((prevUrls) => [...prevUrls, ...fileUrls]);
    }
  };

  return (
    <Layout
      title="Upload Report Template"
      subtitle="Add templates for consistent report formatting"
      isEditable={false}
    >
      <div className="flex flex-col gap-5">
        <Input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          multiple // Allow multiple files
        />

        <div
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`grid w-full cursor-pointer place-items-center rounded-lg border-[4px] border-dashed bg-white transition-all duration-300 ${
            isDragging ? "bg-primary-100/50 border-secondary-100/30" : "py-24"
          } ${files.length > 0 ? "py-20" : "py-24"}`}
        >
          <div className="grid place-items-center gap-1 text-secondary-100/50">
            <MdCloudUpload
              className={`text-[2.8rem] ${isDragging ? "text-primary-500" : ""}`}
            />
            <p className="text-[0.95rem]">
              {isDragging
                ? "Drop the files here to upload"
                : "Upload files or drag and drop"}
            </p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex w-fit items-center gap-5 rounded-md bg-secondary-200-60 px-5 py-3"
              >
                <div className="flex items-center gap-2">
                  <FaFile className="text-[1.2rem]" />
                  <p className="text-[0.9rem]">{file.name}</p>
                </div>

                <Button
                  className="text-[0.8rem] font-semibold"
                  onClick={() => handleRemoveFile(file)}
                >
                  &#x2715;
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="ml-auto space-x-4">
          {files.length > 0 && (
            <Button variant="ghost" onClick={handleCancel} disabled={isPending} >
              Cancel
            </Button>
          )}
          <Button onClick={handleUploadClick} disabled={isPending}>
            Upload
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default ReportTemplateField;
