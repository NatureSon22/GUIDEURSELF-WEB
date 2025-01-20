import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdCloudUpload } from "react-icons/md";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { FaFile } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { createFromUploadDocument } from "@/api/documents";
import { useLocation } from "react-router-dom";

const uploadSchema = z.object({
  // title: z
  //   .string()
  //   .min(1, "Title is required")
  //   .max(100, "Title must be less than 100 characters"),
  visibility: z.enum(["onlyMe", "viewOnly"], {
    required_error: "Visibility is required",
  }),
});

const UploadDocument = () => {
  const { state } = useLocation();
  const folder_id = state?.folder_id;
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      // title: "",
      visibility: "onlyMe",
    },
  });
  const visibility = watch("visibility");

  const { mutateAsync: handleCreateDocument, isPending } = useMutation({
    mutationFn: createFromUploadDocument,
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data,
      });
    },
    onError: (data) => {
      const { message } = data;
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const fileArray = Array.from(selectedFiles);
      setFiles((prevFiles) => [...prevFiles, ...fileArray]);
    }
    setIsDragging(false);
  };

  const handleClick = () => {
    inputRef.current.click();
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
    }
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("document", file));
    formData.append("visibility", data.visibility);
    formData.append("folder_id", folder_id);

    handleCreateDocument(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-1 flex-col gap-8"
    >
      <Input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        multiple
      />
      {/* <div className="space-y-1">
        <p className="font-medium">Title</p>
        <p className="text-[0.95rem]">
          Enter a clear, descriptive title for the document. This will help in
          organizing and retrieving documents.
        </p>
        <Input
          {...register("title")}
          placeholder="Enter the title of the document"
          className="bg-white"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
        )}
      </div> */}
      <div className="space-y-1">
        <p className="font-medium">File Upload</p>
        <p className="text-[0.95rem]">
          Click to upload a file. Accepted formats only include PDF, DOC, and
          PPTX.
        </p>
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
        <p className="mt-1 text-[0.9rem] text-secondary-100-75">
          Note: Ensure the document follows any size and format restrictions
          before uploading. Review all fields before uploading to avoid errors
          or missing information.
        </p>
      </div>

      {files.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex w-fit items-center gap-5 rounded-md bg-secondary-200/40 px-5 py-3"
            >
              <div className="flex items-center gap-3">
                <FaFile className="text-[1.15rem]" />
                <p className="text-[0.85rem]">{file.name}</p>
              </div>

              <Button
                className="ml-2 px-3 text-[0.8rem] font-semibold text-white"
                onClick={() => handleRemoveFile(file)}
              >
                &#x2715;
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-1">
        <p className="font-medium">Visibility</p>
        <p className="text-[0.95rem]">
          Define the visibility of this document. Decide who should be able to
          edit this document.
        </p>
        <RadioGroup
          className="ml-5 mt-3 space-y-3"
          value={visibility}
          onValueChange={(value) => setValue("visibility", value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="onlyMe" id="r1" />
            <Label className="text-secondary-100-75" htmlFor="r1">
              Only me
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="viewOnly" id="r2" />
            <Label className="text-secondary-100-75" htmlFor="r2">
              Allow others to View
            </Label>
          </div>
        </RadioGroup>
        {errors.visibility && (
          <p className="mt-1 text-sm text-red-500">
            {errors.visibility.message}
          </p>
        )}
      </div>
      <div className="ml-auto flex gap-3">
        <Button
          type="submit"
          variant="ghost"
          className="text-base-200"
          disabled={isPending}
        >
          Save as Draft
        </Button>
        <Button type="submit" className="bg-base-200" disabled={isPending}>
          Publish
        </Button>
      </div>
    </form>
  );
};

export default UploadDocument;
