import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import DocumentDialog from "./DocumentDialog";

import { MdCloudUpload } from "react-icons/md";

import DialogContainer from "@/components/DialogContainer";

import {
  createFromUploadDocument,
  getDocument,
  saveAsDraftDocument,
  uploadDraftDocument,
} from "@/api/documents";
import DocumentIcon from "./DocumentIcon";
import Loading from "@/components/Loading";

const ACCEPTED_FILE_TYPES = ["pdf", "doc", "pptx"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const uploadSchema = z.object({
  visibility: z.enum(["onlyMe", "viewOnly"], {
    required_error: "Please select a visibility option",
  }),
  files: z
    .array(
      z
        .any()
        .refine(
          (file) => file?.size <= MAX_FILE_SIZE,
          "File size must be less than 10MB",
        )
        .refine(
          (file) =>
            ACCEPTED_FILE_TYPES.includes(
              file?.name?.split(".")?.pop()?.toLowerCase(),
            ),
          "Invalid file type. Only PDF, DOC, and PPTX are allowed",
        ),
    )
    .optional(),
});

const UploadDocument = () => {
  const navigate = useNavigate();
  const { documentId } = useParams();
  const inputRef = useRef(null);
  const { toast } = useToast();

  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitAction, setSubmitAction] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      visibility: "onlyMe",
      files: [],
    },
  });

  const visibility = watch("visibility");

  const { data: documentData, isLoading: isDocumentLoading } = useQuery({
    queryKey: ["document", documentId],
    queryFn: () => (documentId ? getDocument(documentId) : {}),
    enabled: !!documentId,
  });

  const { mutateAsync: handleCreateDocument } = useMutation({
    mutationFn: createFromUploadDocument,
    onSuccess: () => {
      toast({
        title: "Document Published",
        description: "Your document has been successfully published.",
      });
      navigate(-1);
      queryClient.invalidateQueries(["documents"]);
    },
    onError: (error) => {
      toast({
        title: "Publication Failed",
        description: error.message || "Failed to publish document",
        variant: "destructive",
      });
      setIsProcessing(false);
    },
  });

  const { mutateAsync: handleUploadDocument } = useMutation({
    mutationFn: uploadDraftDocument,
    onSuccess: () => {
      toast({
        title: "Document Published",
        description: "Your document has been successfully published.",
      });
      navigate(-1);
      queryClient.invalidateQueries(["documents"]);
    },
    onError: (error) => {
      toast({
        title: "Publication Failed",
        description: error.message || "Failed to publish document",
        variant: "destructive",
      });
      setIsProcessing(false);
      setOpenDialog(false);
    },
  });

  const { mutateAsync: handleSaveDraft } = useMutation({
    mutationFn: saveAsDraftDocument,
    onSuccess: () => {
      toast({
        title: "Draft Saved",
        description: "Your document has been saved as a draft.",
      });
      navigate(-1);
      queryClient.invalidateQueries(["drafted-documents"]);
    },
    onError: (error) => {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save draft",
        variant: "destructive",
      });
      setIsProcessing(false);
    },
  });

  useEffect(() => {
    if (documentData) {
      setValue("visibility", documentData.visibility);
    }
  }, [documentData, setValue]);

  const handleFileOperation = (fileList) => {
    if (isProcessing) return;

    const newFiles = Array.from(fileList);
    const validFiles = newFiles.filter((file) => {
      const isValidType = ACCEPTED_FILE_TYPES.includes(
        file.name.split(".").pop().toLowerCase(),
      );
      const isValidSize = file.size <= MAX_FILE_SIZE;

      if (!isValidType || !isValidSize) {
        toast({
          title: "Invalid File",
          description: `${file.name} was rejected. Please check file type and size.`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    setFiles((prev) => [...prev, ...validFiles]);
    setValue("files", validFiles);
  };

  const handleDragEvents = (e) => {
    if (isProcessing) return;

    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave" || e.type === "drop") {
      setIsDragging(false);
      if (e.type === "drop") {
        handleFileOperation(e.dataTransfer.files);
      }
    }
  };

  const downloadFile = async (document_url) => {
    try {
      const response = await fetch(document_url);

      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }

      const blob = await response.blob();
      const fileName = documentData.file_name;
      const file = new File([blob], fileName, {
        type: blob.type || "application/octet-stream",
      });

      return file;
    } catch (e) {
      console.error("Download Error:", e);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download the document",
      });
    }
  };

  const handleSubmitForm = async (data) => {
    const formData = new FormData();

    if (documentData?.document_url) {
      formData.append("documentId", documentData._id);
      formData.append("document_url", documentData.document_url);
    } else {
      if (files.length === 0) {
        toast({
          title: "No Files Selected",
          description: "Please select at least one file to upload",
          variant: "destructive",
        });
        return;
      }
      files.forEach((file) => formData.append("document", file));
    }
    formData.append("visibility", data.visibility);
    setIsProcessing(true);
    setOpenDialog(true);
    try {
      if (submitAction === "publish") {
        if (documentData?.document_url) {
          const file = await downloadFile(documentData.document_url);
          formData.append("document", file);
          await handleUploadDocument(formData);
        } else {
          await handleCreateDocument(formData);
        }
      } else {
        await handleSaveDraft(formData);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setIsProcessing(false);
    }
  };

  const renderDragDropArea = () => (
    <div
      onClick={() => !isProcessing && inputRef.current?.click()}
      onDragEnter={handleDragEvents}
      onDragOver={handleDragEvents}
      onDragLeave={handleDragEvents}
      onDrop={handleDragEvents}
      className={`grid w-full cursor-pointer place-items-center rounded-lg border-4 border-dashed ${isDragging ? "border-primary-500 bg-primary-100/30" : "border-secondary-100/20"} ${files.length > 0 ? "py-20" : "py-24"} ${isProcessing ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <div className="grid place-items-center gap-1 text-secondary-100/50">
        <MdCloudUpload
          className={`text-4xl ${isDragging ? "text-primary-500" : ""}`}
        />
        <p className="text-base">
          {isDragging ? "Drop files here" : "Upload files or drag and drop"}
        </p>
      </div>
    </div>
  );

  const renderFileList = () => (
    <div className="flex flex-wrap gap-3">
      {files.map((file, index) => (
        <div
          key={index}
          className="flex items-center gap-5 rounded-md border bg-secondary-200/20 px-5 py-3"
        >
          {/* <FaFile className="text-lg" /> */}
          <p className="text-sm">{file.name}</p>

          <div
            className="cursor-pointer rounded-md bg-secondary-210/30 px-3 py-1 text-[0.95rem] font-bold hover:bg-secondary-100-75/20"
            onClick={() => {
              if (!isProcessing) {
                setFiles((prev) => prev.filter((_, i) => i !== index));
                setValue(
                  "files",
                  files.filter((_, i) => i !== index),
                );
              }
            }}
            disabled={isProcessing}
          >
            &#10005;
          </div>

          {/* <Button
            className="ml-2 px-3 text-sm font-semibold text-white"
            onClick={() => {
              if (!isProcessing) {
                setFiles((prev) => prev.filter((_, i) => i !== index));
                setValue(
                  "files",
                  files.filter((_, i) => i !== index),
                );
              }
            }}
            disabled={isProcessing}
          >
            ×
          </Button> */}
        </div>
      ))}
    </div>
  );

  if (isDocumentLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <form
      onSubmit={handleSubmit(handleSubmitForm)}
      className="flex flex-1 flex-col gap-8"
    >
      <Input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => handleFileOperation(e.target.files)}
        multiple
        accept={ACCEPTED_FILE_TYPES.map((type) => `.${type}`).join(",")}
        disabled={isProcessing}
      />

      <div className="grid gap-4">
        <div>
          <h2 className="font-medium">File Upload</h2>
          <p className="text-base text-gray-600">
            Upload your documents in PDF, DOC, or PPTX format.
          </p>
        </div>

        {documentData?.document_url ? (
          <DocumentIcon
            name={documentData.file_name}
            setOpen={setIsDialogOpen}
          />
        ) : (
          files.length === 0 && renderDragDropArea()
        )}

        {files.length > 0 && renderFileList()}
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="font-medium">Visibility Settings</h2>
          <p className="text-base text-gray-600">
            Control who can access this document.
          </p>
        </div>

        <RadioGroup
          className={`ml-5 space-y-3 ${isProcessing ? "opacity-50" : ""}`}
          value={visibility}
          onValueChange={(value) =>
            !isProcessing && setValue("visibility", value)
          }
          disabled={isProcessing}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="onlyMe" id="r1" disabled={isProcessing} />
            <Label htmlFor="r1">Only me</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="viewOnly" id="r2" disabled={isProcessing} />
            <Label htmlFor="r2">Allow others to view</Label>
          </div>
        </RadioGroup>
        {errors.visibility && (
          <p className="text-sm text-red-500">{errors.visibility.message}</p>
        )}
      </div>

      <div className="ml-auto flex gap-3">
        {!documentId && (
          <Button
            type="submit"
            variant="ghost"
            className="text-base-200"
            disabled={isProcessing}
            onClick={() => setSubmitAction("draft")}
          >
            {isProcessing && submitAction === "draft"
              ? "Saving..."
              : "Save as Draft"}
          </Button>
        )}
        <Button
          type="submit"
          className="bg-base-200"
          disabled={isProcessing}
          onClick={() => {
            setSubmitAction("publish");
          }}
        >
          {isProcessing && submitAction === "publish"
            ? "Publishing..."
            : "Publish"}
        </Button>
      </div>

      <DialogContainer openDialog={openDialog}>
        {submitAction === "draft" ? (
          <div className="grid place-items-center gap-7 py-1">
            <Loading />
            <p className="text-[0.9rem] font-semibold">
              Please wait while the document is being saved
            </p>
          </div>
        ) : (
          <div className="grid place-items-center gap-7 py-1">
            <Loading />
            <p className="text-[0.9rem] font-semibold">
              Please wait while the document is being uploaded
            </p>
          </div>
        )}
      </DialogContainer>

      <DocumentDialog
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        document_url={documentData?.document_url}
      />
    </form>
  );
};

export default UploadDocument;
