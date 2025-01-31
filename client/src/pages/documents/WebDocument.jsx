import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getDocument, saveAsDraftWeb, uploadFromWeb } from "@/api/documents";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  title: z.string().optional(),
  websiteURL: z
    .string()
    .url("Enter a valid URL")
    .nonempty("Website URL is required"),
  author: z.string().optional(),
  visibility: z.enum(["onlyMe", "viewOnly"], {
    required_error: "Visibility is required",
  }),
});

const WebDocument = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const client = useQueryClient();
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
      websiteURL: "",
      author: "",
      visibility: "onlyMe",
    },
  });

  const { toast } = useToast();
  const [action, setAction] = useState("publish");
  const { mutateAsync: handleUploadFromWeb, isPending } = useMutation({
    mutationFn: uploadFromWeb,
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data,
      });
      client.invalidateQueries(["documents", "drafted-documents"]);
      navigate(-1);
    },
    onError: (error) => {
      const { message } = error;
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    },
  });

  const { mutateAsync: handleSaveAsDraft, isPending: isSaving } = useMutation({
    mutationFn: saveAsDraftWeb,
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data,
      });
      client.invalidateQueries(["documents"]);
      navigate(-1);
    },
    onError: (error) => {
      const { message } = error;
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    },
  });

  const visibility = watch("visibility");

  const { data: document, isLoading: isDocumentLoading } = useQuery({
    queryKey: ["document", documentId],
    queryFn: () => {
      if (!documentId) return {};
      return getDocument(documentId);
    },
  });

  useEffect(() => {
    if (document && documentId) {
      setValue("title", document.metadata.title);
      setValue("websiteURL", document.metadata.url);
      setValue("author", document.metadata.author);
      setValue("visibility", document.metadata.visibility);
    }
  }, [document, documentId, setValue]);

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("visibility", data.visibility);
    formData.append("url", data.websiteURL);
    formData.append("author", data.author);

    if (documentId) {
      formData.append("documentId", documentId);
    }

    if (action === "publish") {
      handleUploadFromWeb(formData);
    } else {
      handleSaveAsDraft(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Title Field */}
      <div className="space-y-1">
        <p className="font-medium">Title</p>
        <p className="text-[0.95rem]">
          This field will auto-populate with the website’s title, but you can
          edit it to better match the purpose of the content being imported.
        </p>
        {isDocumentLoading ? (
          <Skeleton className="w-full py-5"></Skeleton>
        ) : (
          <>
            <Input
              {...register("title")}
              placeholder="Auto-filled/Editable"
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

      {/* Website URL Field */}
      <div className="space-y-1">
        <p className="font-medium">Website URL</p>
        <p className="text-[0.95rem]">
          Enter the full URL of the website you want to import. Ensure the link
          is accessible and contains relevant content for the chatbot.
        </p>
        {isDocumentLoading ? (
          <Skeleton className="w-full py-5"></Skeleton>
        ) : (
          <>
            <Input
              {...register("websiteURL")}
              placeholder="Copy and paste your URL link here"
              className="bg-white"
            />
            {errors.websiteURL && (
              <p className="mt-1 text-sm text-red-500">
                {errors.websiteURL.message}
              </p>
            )}
          </>
        )}
      </div>

      {/* Author Field */}
      <div className="space-y-1">
        <p className="font-medium">Author/Source</p>
        <p className="text-[0.95rem]">
          The field will auto-populate based on the website’s metadata, but you
          can edit it to properly credit the original source.
        </p>

        {isDocumentLoading ? (
          <Skeleton className="w-full py-5"></Skeleton>
        ) : (
          <>
            <Input
              {...register("author")}
              placeholder="Author-filled/Editable"
              className="bg-white"
            />
            {errors.author && (
              <p className="mt-1 text-sm text-red-500">
                {errors.author.message}
              </p>
            )}
          </>
        )}
      </div>

      {/* Note Section */}
      <p className="mt-1 text-[0.9rem] text-secondary-100-75">
        Note: Ensure the website you’re importing from allows scraping or
        copying of text content. Review the extracted text for accuracy, as some
        websites may include extraneous information not relevant for chatbot
        responses.
      </p>

      {/* Visibility Field */}
      <div className="grid gap-1">
        <p className="font-medium">Visibility</p>
        <p className="text-[0.95rem]">
          Define the visibility of this document. Decide who should be able to
          edit this document.
        </p>

        {isDocumentLoading ? (
          <div className="ml-5 mt-3 space-y-3">
            {Array.from({ length: 2 }).map((_, index) => (
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
            </RadioGroup>
            {errors.visibility && (
              <p className="mt-1 text-sm text-red-500">
                {errors.visibility.message}
              </p>
            )}
          </>
        )}
      </div>

      {/* Action Buttons */}
      {!isDocumentLoading && (
        <div className="ml-auto flex gap-3">
          <Button
            type="submit"
            variant="ghost"
            className="text-base-200"
            disabled={isPending || isSaving}
            onClick={() => setAction("draft")}
          >
            Save as Draft
          </Button>
          <Button
            type="submit"
            className="bg-base-200"
            disabled={isPending || isSaving}
            onClick={() => setAction("publish")}
          >
            Publish
          </Button>
        </div>
      )}
    </form>
  );
};

export default WebDocument;
