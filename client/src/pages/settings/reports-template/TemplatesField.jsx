import Layout from "@/components/Layout";
import { RiListUnordered } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getTemplates } from "@/api/template";
import TemplateIcon from "./TemplateIcon";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import TemplateDialog from "./TemplateDialog";

const TemplatesField = () => {
  const { data: files, isLoading } = useQuery({
    queryKey: ["files"],
    queryFn: getTemplates,
  });
  const [listStyle, setListStyle] = useState("grid");
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setListStyle((prev) => (prev === "list" ? "grid" : "list"));
  };

  return (
    <Layout isEditable={false} withHeader={false}>
      <div className="grid gap-2">
        <Button
          className="ml-auto w-min"
          variant="outline"
          onClick={handleClick}
        >
          <RiListUnordered />
        </Button>

        <div>
          {isLoading ? (
            <div className="flex flex-wrap items-center gap-8">
              <Skeleton className="px-14 py-14"></Skeleton>
              <Skeleton className="px-14 py-14"></Skeleton>
              <Skeleton className="px-14 py-14"></Skeleton>
              <Skeleton className="px-14 py-14"></Skeleton>
              <Skeleton className="px-14 py-14"></Skeleton>
            </div>
          ) : files?.length > 0 ? (
            <div
              className={
                listStyle === "grid"
                  ? "flex flex-wrap items-center gap-10"
                  : "mt-5 grid grid-cols-5 gap-5"
              }
            >
              {files.map((file) => (
                <TemplateIcon
                  key={file._id}
                  name={file.name}
                  listStyle={listStyle}
                  setOpen={setOpen}
                />
              ))}
            </div>
          ) : (
            <div className="grid place-items-center py-8">
              <p className="text-secondary-100-75">No templates available.</p>
            </div>
          )}
        </div>
      </div>

      <TemplateDialog open={open} setOpen={setOpen} />
    </Layout>
  );
};

export default TemplatesField;
