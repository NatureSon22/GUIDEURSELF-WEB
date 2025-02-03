import formatDateTime from "@/utils/formatDateTime";
import { Button } from "../ui/button";
import { BiSolidEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

const handleNavigate = (navigate, type, id) => {
  const route =
    type == "created-document"
      ? `/documents/write-document/${id}`
      : type == "imported-web"
        ? `/documents/import-website/${id}`
        : `/documents/upload-document/${id}`;
  navigate(route);
};

const column = ({ navigate, setOpen, setSelectedDocument }) => {
  return [
    {
      accessorKey: "file_name",
      header: "Filename",
      filterFn: "equalsString",
    },
    {
      accessorKey: "published_by",
      header: "Published by",
      filterFn: "equalsString",
    },
    {
      accessorKey: "date_and_time",
      header: "Date and Time Created",
      filterFn: "equalsString",
      cell: ({ row }) => formatDateTime(row.original.date_and_time),
    },
    {
      header: "Action",
      cell: ({ row }) => (
        <div className="flex items-center gap-5">
          <div className="ml-auto"></div>
          <Button
            variant="secondary"
            className="group bg-base-200/10 text-base-200 hover:bg-base-200 hover:text-white"
            onClick={() =>
              handleNavigate(
                navigate,
                row.original.document_type,
                row.original._id,
              )
            }
          >
            <BiSolidEdit />
            Edit
          </Button>

          <Button
            variant="destructive"
            className="group rounded-full bg-accent-100/10 px-[0.65rem]"
            onClick={() => {
              setOpen(true);
              setSelectedDocument(row.original._id);
            }}
          >
            <MdDelete className="text-accent-100 group-hover:text-white" />
          </Button>
          <div className="mr-auto"></div>
        </div>
      ),
    },
  ];
};

export default column;
