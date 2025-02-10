import formatDateTime from "@/utils/formatDateTime";
import { Button } from "../ui/button";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";

const handleNavigate = (navigate, type, id) => {
  const route =
    type == "created-document"
      ? `/documents/write-document/${id}`
      : type == "imported-web"
        ? `/documents/import-website/${id}`
        : `/documents/upload-document/${id}`;
  navigate(route);
};

const column = ({ navigate, setOpen, setSelectedDocument }) => [
  {
    accessorKey: "file_name",
    header: "Filename",
    filterFn: "equalsString",
    cell: ({ row }) => (
      <Link
        to={`/documents/view/${row.original._id}`}
        className="hover:underline"
        title={row.original.file_name}
      >
        {row.original.file_name.length > 20
          ? row.original.file_name.slice(0, 20) + "..."
          : row.original.file_name}
      </Link>
    ),
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
    accessorKey: "contributors",
    header: "Contributor",
    filterFn: "equalsString",
  },
  {
    accessorKey: "date_last_modified",
    header: "Date Last Modified",
    cell: ({ row }) => formatDateTime(row.original.date_last_modified),
  },
  {
    accessorKey: "campus_id.campus_name",
    id: "campus_id.campus_name",
    enableHiding: true,
  },
  {
    accessorKey: "document_type",
    id: "document_type",
    enableHiding: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: "equalsString",
    cell: ({ row }) => (
      <div className="grid place-items-center">
        <span
          className={`w-[85px] rounded-full px-2 py-2 text-center text-xs font-medium ${
            row.original.status === "synced"
              ? "bg-accent-400 text-accent-300"
              : row.original.status === "syncing"
                ? "bg-accent-700 text-accent-600"
                : "bg-accent-200 text-accent-100"
          }`}
        >
          {row.original.status}
        </span>
      </div>
    ),
  },
  {
    header: "Action",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-5">
          <div className="ml-auto"></div>

          {/* <Button
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
          </Button> */}

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
      );
    },
  },
];

export default column;
