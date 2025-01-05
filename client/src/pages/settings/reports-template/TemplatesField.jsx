import Layout from "@/components/Layout";
import { RiListUnordered } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getTemplates } from "@/api/template";
import TemplateIcon from "./TemplateIcon";

const TemplatesField = () => {
  const { data: files, isLoading } = useQuery({
    queryKey: ["files"],
    queryFn: getTemplates,
  });

  return (
    <Layout isEditable={false} withHeader={false}>
      <div className="grid gap-2">
        {/* Button for toggling view */}
        <Button className="ml-auto w-min" variant="outline">
          <RiListUnordered />
        </Button>

        {/* File list */}
        <div>
          {isLoading ? (
            <p>Loading files...</p> // Add loading indicator
          ) : files?.length > 0 ? (
            <div className="flex flex-wrap items-center gap-10">
              {files.map((file) => (
                <TemplateIcon key={file._id} name={file.name} />
              ))}
            </div>
          ) : (
            <p>No templates available.</p> // Fallback message for empty list
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TemplatesField;
