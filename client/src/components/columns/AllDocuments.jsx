import formatDateTime from "@/utils/formatDateTime";
import { Button } from "../ui/button";
import { MdDelete } from "react-icons/md";
import { BiSolidEdit } from "react-icons/bi";
import { FaEllipsis } from "react-icons/fa6";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { FaEye } from "react-icons/fa";
import FeaturePermission from "@/layer/FeaturePermission";

const handleNavigate = (navigate, type, id) => {
  const routes = {
    "created-document": `/documents/write-document/${id}`,
    "imported-web": `/documents/import-website/${id}`,
  };

  const route = routes[type] || `/documents/upload-document/${id}`;

  navigate(route, { state: { isEditing: Boolean(true) } });
};

const column = ({
  navigate,
  setOpen,
  setSelectedDocument,
  isDarkMode = false,
}) => [
  {
    accessorKey: "file_name",
    header: "Filename",
    filterFn: "equalsString",
    cell: ({ row }) => (
      <p
        className="cursor-pointer hover:underline"
        onClick={() => {
          navigate(`/documents/view/${row.original._id}`);
        }}
      >
        {row.original.file_name.length > 20
          ? row.original.file_name.slice(0, 20) + "..."
          : row.original.file_name}
      </p>
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
    header: "Campus",
    filterFn: "equalsString",
  },
  {
    accessorKey: "document_type",
    id: "document_type",
    header: "Document Type",
    filterFn: "equalsString",
    cell: ({ row }) => {
      const type = row.original.document_type;
      let fileType = "";

      if (type === "created-document") {
        fileType = "Created";
      } else if (type === "imported-web") {
        fileType = "Imported";
      } else {
        fileType = "Uploaded";
      }

      return <p>{fileType}</p>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: "equalsString",
    cell: ({ row }) => (
      <div className="grid place-items-center">
        <span
          className={`w-[85px] rounded-full px-2 py-2 text-center text-xs font-medium ${
            isDarkMode
              ? row.original.status === "synced"
                ? "bg-accent-300 text-accent-400"
                : row.original.status === "syncing"
                  ? "bg-accent-600 text-accent-700"
                  : "bg-accent-100 text-accent-200"
              : row.original.status === "synced"
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
      const editable = row.original.visibility === "viewAndEdit";
      const isOwner = row.original.published_by === "You";

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={`mx-4 py-1 ${isDarkMode ? "border-dark-secondary-100-75 bg-dark-base-bg" : ""} `}
            >
              <FaEllipsis />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className={`mt-1 grid w-[135px] gap-1 rounded-md p-3 shadow-md ${isDarkMode ? "border border-dark-text-base-300 bg-dark-base-bg" : "bg-white"} `}
          >
            <Button
              variant="ghost"
              className={`w-full bg-secondary-200/10 text-[0.85rem] ${isDarkMode ? "text-dark-text-base-300" : "text-secondary-100-75"} `}
              onClick={() => {
                navigate(`/documents/view/${row.original._id}`);
              }}
            >
              <div className="w"></div>
              <FaEye />
              <p className="">View</p>
            </Button>

            <FeaturePermission module="Manage Documents" access="edit file">
              {(editable || isOwner) && (
                <Button
                  variant="ghost"
                  className={`w-full bg-secondary-200/10 text-[0.85rem] ${isDarkMode ? "text-dark-text-base-300" : "text-secondary-100-75"} `}
                  onClick={() =>
                    handleNavigate(
                      navigate,
                      row.original.document_type,
                      row.original._id,
                    )
                  }
                >
                  <BiSolidEdit />
                  <p className="">Edit</p>
                </Button>
              )}
            </FeaturePermission>

            {isOwner && (
              <Button
                variant="destructive"
                className="group bg-accent-100/10"
                onClick={() => {
                  setOpen(true);
                  setSelectedDocument(row.original._id);
                }}
              >
                <MdDelete className="text-accent-100 group-hover:text-white" />
                <p className="text-accent-100 group-hover:text-white">
                  Archive
                </p>
              </Button>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default column;
