import { useParams } from "react-router-dom";
import { getDocument } from "@/api/documents";
import { useQuery } from "@tanstack/react-query";
import { CreateNewDocument } from "@/routescomponents";

const EditCreatedDocument = () => {
  const { documentId } = useParams();

  const { data: documentData, isLoading } = useQuery({
    queryKey: ["document", documentId],
    queryFn: () => getDocument(documentId),
  });

  return isLoading ? <>Loading...</> : <CreateNewDocument defaultValues={documentData.metadata} />;
};

export default EditCreatedDocument;
