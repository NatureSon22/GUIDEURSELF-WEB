import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createDocument,
  saveAsDraft,
  getDocument,
  updateCreateDocument,
} from "@/api/documents";

import { Input } from "../../components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useToast } from "@/hooks/use-toast";
import TextEditor from "@/components/TextEditor";
import Loading from "@/components/Loading";
import DialogContainer from "@/components/DialogContainer";
import { useLocation } from "react-router-dom";
import useToggleTheme from "@/context/useToggleTheme";

// Form validation schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z.string().min(1, "Content is required"),
  visibility: z.enum(["onlyMe", "viewOnly", "viewAndEdit"], {
    required_error: "Visibility selection is required",
  }),
});

const CreateNewDocument = () => {
  const { state } = useLocation();
  const isEditing = state?.isEditing ? true : false;
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [action, setAction] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const queryClient = useQueryClient();

  // Initialize the form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      visibility: "onlyMe",
    },
  });

  const visibility = watch("visibility");
  const content = watch("content"); // To keep track of the content field
  const { isDarkMode } = useToggleTheme((state) => state);

  // Fetch document if editing
  const { data: documentData, isLoading } = useQuery({
    queryKey: ["document", documentId],
    queryFn: () => (documentId ? getDocument(documentId) : null),
    enabled: !!documentId,
  });

  // Create Document Mutation
  const { mutateAsync: handleCreateDocument, isPending: isCreating } =
    useMutation({
      mutationFn: createDocument,
      onSuccess: (data) => {
        toast({
          title: "Success",
          description: data.message,
        });
        navigate(-1);
        setOpenDialog(false);
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
        setOpenDialog(false);
      },
    });

  // Save Draft Mutation
  const { mutateAsync: handleSaveAsDraft, isPending: isSaving } = useMutation({
    mutationFn: saveAsDraft,
    onSuccess: (data) => {
      queryClient.invalidateQueries([""]);
      toast({
        title: "Success",
        description: data.message,
      });
      navigate("/documents/all-documents");
      setOpenDialog(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      setOpenDialog(false);
    },
  });

  const { mutateAsync: handleUpdateDocument } = useMutation({
    mutationFn: updateCreateDocument,
    onSuccess: () => {
      toast({
        title: "Document updated successfully",
        description: "Operation completed successfully",
      });
      navigate(-1);
      setOpenDialog(false);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update document",
      });
      setOpenDialog(false);
    },
  });

  // Populate fields if editing an existing document
  useEffect(() => {
    if (documentData?.metadata) {
      const { name, content, visibility } = documentData.metadata;
      setValue("title", documentData.file_name || name, {
        shouldValidate: true,
      });
      setValue("content", documentData.content || content, {
        shouldValidate: true,
      });
      setValue("visibility", documentData.visibility || visibility, {
        shouldValidate: true,
      });
    }
  }, [documentData, setValue]);

  const handleSetAction = (action) => {
    setAction(action);
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.title);
    formData.append("content", data.content);
    formData.append("visibility", data.visibility);

    setOpenDialog(true);

    if (isEditing) {
      formData.append("id", documentId);
      formData.append("docId", documentData.document_id);
      handleUpdateDocument(formData);
      return;
    }

    if (documentId) {
      formData.append("documentId", documentId);
    }

    if (action === "publish") {
      handleCreateDocument(formData);
    } else {
      handleSaveAsDraft(formData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-1 flex-col gap-7"
    >
      {/* Title Field */}
      <div
        className={`space-y-1 ${isDarkMode ? "text-dark-text-base-300" : ""} `}
      >
        <p className="font-medium">Title</p>
        <p className="text-[0.95rem]">
          Enter a clear, descriptive title for the document.
        </p>
        {isLoading ? (
          <Skeleton className="w-full py-5" />
        ) : (
          <>
            <Input
              {...register("title")}
              placeholder="Enter the title of the document"
              className={`${isDarkMode ? "border-transparent bg-dark-secondary-100-75/20 text-dark-text-base-300-75 !placeholder-dark-secondary-100-75" : ""}`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">
                {errors.title.message}
              </p>
            )}
          </>
        )}
      </div>

      <div
        className={`grid gap-1 ${isDarkMode ? "text-dark-text-base-300" : ""} `}
      >
        <p className="font-medium">Content</p>
        <p className="text-[0.95rem]">
          Write the main content that the chatbot will use.
        </p>

        {isLoading ? (
          <Skeleton className="w-full py-40" />
        ) : (
          <>
            <div className="space-y-14">
              <div className="mt-1 min-h-[300px] items-center">
                <TextEditor
                  content={content}
                  setContent={(value) =>
                    setValue("content", value, { shouldValidate: true })
                  }
                />
              </div>

              {errors.content && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.content.message}
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Visibility Options */}
      <div className="grid gap-1">
        <p
          className={`font-medium ${isDarkMode ? "text-dark-text-base-300" : ""} `}
        >
          Visibility
        </p>
        {isLoading ? (
          <div className="ml-5 mt-3 space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="w-44 py-4" />
            ))}
          </div>
        ) : (
          <RadioGroup
            className="ml-5 mt-3 space-y-3"
            value={visibility}
            onValueChange={(value) => setValue("visibility", value)}
          >
            <div className={"flex items-center space-x-2"}>
              <RadioGroupItem
                value="onlyMe"
                className={`${isDarkMode ? "border-dark-text-base-300" : ""}`}
                fillbase={isDarkMode ? "fill-white" : "fill-base-300"}
                id="r1"
              />
              <Label
                className={` ${isDarkMode ? "text-dark-text-base-300-75" : "text-secondary-100-75"} `}
                htmlFor="r1"
              >
                Only me
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="viewOnly"
                className={`${isDarkMode ? "border-dark-text-base-300" : ""}`}
                fillbase={isDarkMode ? "fill-white" : "fill-base-300"}
                id="r2"
              />
              <Label
                className={` ${isDarkMode ? "text-dark-text-base-300-75" : "text-secondary-100-75"} `}
                htmlFor="r2"
              >
                Allow others to View
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="viewAndEdit"
                className={`${isDarkMode ? "border-dark-text-base-300" : ""}`}
                fillbase={isDarkMode ? "fill-white" : "fill-base-300"}
                id="r3"
              />
              <Label
                className={` ${isDarkMode ? "text-dark-text-base-300-75" : "text-secondary-100-75"} `}
                htmlFor="r3"
              >
                Allow others to View and Edit
              </Label>
            </div>
          </RadioGroup>
        )}

        {errors.visibility && (
          <p className="mt-1 text-sm text-red-500">
            {errors.visibility.message}
          </p>
        )}
      </div>

      {!isLoading && (
        <div className="ml-auto flex gap-3">
          {!isEditing && (
            <Button
              type="submit"
              variant="ghost"
              className="text-base-200"
              disabled={isCreating || isSaving}
              onClick={() => handleSetAction("draft")}
            >
              Save as Draft
            </Button>
          )}

          <Button
            type="submit"
            className="bg-base-200"
            disabled={isCreating || isSaving}
            onClick={() => handleSetAction("publish")}
          >
            Publish
          </Button>
        </div>
      )}

      <DialogContainer openDialog={openDialog}>
        {action === "draft" ? (
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
    </form>
  );
};

export default CreateNewDocument;
