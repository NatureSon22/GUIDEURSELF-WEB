import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";

import { createDocument, saveAsDraft, getDocument } from "@/api/documents";

import { Input } from "../../components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import TipTapEditor from "@/components/TextEditor";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useToast } from "@/hooks/use-toast";

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
  const [editorContent, setEditorContent] = useState("");

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

  const { data: documentData, isLoading } = useQuery({
    queryKey: ["document", documentId],
    queryFn: () => (documentId ? getDocument(documentId) : null),
    enabled: !!documentId,
  });

  const { mutateAsync: handleCreateDocument, isPending: isCreating } =
    useMutation({
      mutationFn: createDocument,
      onSuccess: (data) => {
        toast({
          title: "Success",
          description: data.message,
        });
        navigate(-1);
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      },
    });

  const { mutateAsync: handleSaveAsDraft, isPending: isSaving } = useMutation({
    mutationFn: saveAsDraft,
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data.message,
      });
      navigate(-1);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  useEffect(() => {
    if (documentData?.metadata) {
      const { name, content, visibility } = documentData.metadata;
      setValue("title", name, { shouldValidate: true });
      setValue("content", content, { shouldValidate: true });
      setEditorContent(content); // Set editor content separately
      setValue("visibility", visibility, { shouldValidate: true });
    }
  }, [documentData, setValue]);

  const handleContentUpdate = useCallback((newContent) => {
    setEditorContent(newContent);
  }, []);

  const handleSetAction = (action) => {
    setAction(action);
  };

  const onSubmit = (data) => {
    console.log("Editor Content Before setValue:", editorContent);
    // setValue("content", editorContent, { shouldValidate: true });
    console.log("Form Data After setValue:", data);

    const formData = new FormData();
    formData.append("name", data.title);
    formData.append("content", editorContent);
    formData.append("visibility", data.visibility);

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
      <div className="space-y-1">
        <p className="font-medium">Title</p>
        <p className="text-[0.95rem]">
          Enter a clear, descriptive title for the document. This will help in
          organizing and retrieving documents.
        </p>
        {isLoading ? (
          <Skeleton className="w-full py-5"></Skeleton>
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
          Write the main content that the chatbot will use to respond to users.
          Use simple, direct language for better understanding.
        </p>

        {isLoading ? (
          <Skeleton className="w-full py-40"></Skeleton>
        ) : (
          <>
            <p>{editorContent}</p>
            <TipTapEditor
              documentContent={editorContent}
              setDocumentContent={handleContentUpdate}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-500">
                {errors.content.message}
              </p>
            )}
            <p className="mt-1 text-[0.9rem] text-secondary-100-75">
              Note: Ensure the content is concise and factual to make it easy
              for the chatbot to communicate effectively. Use bullet points or
              numbered lists when appropriate for better readability.
            </p>
          </>
        )}
      </div>

      <div className="grid gap-1">
        <p className="font-medium">Visibility</p>
        <p className="text-[0.95rem]">
          Define the visibility of this document. Decide who should be able to
          edit this document.
        </p>

        {isLoading ? (
          <div className="ml-5 mt-3 space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className={"w-44 py-4"} />
            ))}
          </div>
        ) : (
          <>
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
          </>
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
    </form>
  );
};

export default CreateNewDocument;
