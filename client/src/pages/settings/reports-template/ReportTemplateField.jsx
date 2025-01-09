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
  const [fileURL, setFileUrl] = useState(null);
  const [file, setFile] = useState(null);
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
      setFileUrl(null);
      setFile(null);
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
    const file = e.target.files[0];

    if (file) {
      setFileUrl({ uri: URL.createObjectURL(file) });
      setFile(file);
    }
    setIsDragging(false);
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleUploadClick = () => {
    const formData = new FormData();
    formData.append("template", file);

    handleUpload(formData);
  };

  const handleCancel = () => {
    setFileUrl(null);
    setFile(null);
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

    const file = e.dataTransfer.files[0];
    if (file) {
      setFileUrl({ uri: URL.createObjectURL(file) });
      setFile(file);
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
        />

        <div
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`grid w-full cursor-pointer place-items-center rounded-lg border-[4px] border-dashed bg-white transition-all duration-300 ${
            isDragging ? "bg-primary-100/50 border-secondary-100/30" : "py-24"
          } ${file ? "py-20" : "py-24"}`}
        >
          <div className="grid place-items-center gap-1 text-secondary-100/50">
            <MdCloudUpload
              className={`text-[2.8rem] ${
                isDragging ? "text-primary-500" : ""
              }`}
            />
            <p className="text-[0.95rem]">
              {isDragging
                ? "Drop the file here to upload"
                : "Upload a file or drag and drop"}
            </p>
          </div>
        </div>

        {file && (
          <div className="flex w-fit items-center gap-3 rounded-md bg-secondary-200-60 px-5 py-3">
            <FaFile className="text-[1.2rem]" />
            <p className="text-[0.9rem]">{file.name}</p>
          </div>
        )}

        <div className="ml-auto space-x-4">
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleUploadClick} disabled={isPending}>
            Upload
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default ReportTemplateField;
