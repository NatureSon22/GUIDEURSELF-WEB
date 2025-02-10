import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";

import { createDocument, saveAsDraft, getDocument } from "@/api/documents";

import { Input } from "../../components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useToast } from "@/hooks/use-toast";
import TextEditor from "@/components/TextEditor";
import Loading from "@/components/Loading";
import DialogContainer from "@/components/DialogContainer";

// Form validation schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z.string().min(1, "Content is required"),
  visibility: z.enum(["onlyMe", "viewOnly", "viewAndEdit"], {
    required_error: "Visibility selection is required",
  }),
});

const CreateNewDocument = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [action, setAction] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

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

  // Populate fields if editing an existing document
  useEffect(() => {
    if (documentData?.metadata) {
      const { name, content, visibility } = documentData.metadata;
      setValue("title", name, { shouldValidate: true });
      setValue("content", content, { shouldValidate: true });
      setValue("visibility", visibility, { shouldValidate: true });
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
      <div className="space-y-1">
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
              className="bg-white"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">
                {errors.title.message}
              </p>
            )}
          </>
        )}
      </div>

      <div className="grid gap-1">
        <p className="font-medium">Content</p>
        <p className="text-[0.95rem]">
          Write the main content that the chatbot will use.
        </p>

        {isLoading ? (
          <Skeleton className="w-full py-40" />
        ) : (
          <>
            <div className="space-y-14">
              <div className="min-h-[300px] items-center mt-1">
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
        <p className="font-medium">Visibility</p>
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
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="viewAndEdit" id="r3" />
            <Label className="text-secondary-100-75" htmlFor="r3">
              Allow others to View and Edit
            </Label>
          </div>
        </RadioGroup>
        {errors.visibility && (
          <p className="mt-1 text-sm text-red-500">
            {errors.visibility.message}
          </p>
        )}
      </div>

      {!isLoading && (
        <div className="ml-auto flex gap-3">
          <Button
            type="submit"
            variant="ghost"
            className="text-base-200"
            disabled={isCreating || isSaving}
            onClick={() => handleSetAction("draft")}
          >
            Save as Draft
          </Button>

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
