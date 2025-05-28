import formatDateTime from "@/utils/formatDateTime";
import { Button } from "../ui/button";
import { BiSolidEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { FaEllipsis } from "react-icons/fa6";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

const handleNavigate = (navigate, type, id) => {
  const route =
    type == "created-document"
      ? `/documents/write-document/${id}`
      : type == "imported-web"
        ? `/documents/import-website/${id}`
        : `/documents/upload-document/${id}`;
  navigate(route);
};

const column = ({
  navigate,
  setOpen,
  setSelectedDocument,
  isDarkMode = false,
}) => {
  return [
    {
      accessorKey: "file_name",
      header: "Filename",
      filterFn: "equalsString",
      size: 100,
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
      accessorKey: "campus_id.campus_name",
      id: "campus_id.campus_name",
      header: "Campus",
    },
    {
      header: "Document Type",
      accessorKey: "document_type",
      id: "document_type",
      enableHiding: true,
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
      header: "Action",
      cell: ({ row }) => {
        const editable = row.original.visibility === "viewAndEdit";
        const isOwner = row.original.published_by === "You";

        return (
          <div className="grid place-items-center">
            <DropdownMenu>
              <DropdownMenuTrigger className="" asChild>
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
          </div>
        );

        // <div className="flex items-center gap-5">
        //   <div className="ml-auto"></div>
        //   <Button
        //     variant="secondary"
        //     className="group bg-base-200/10 text-base-200 hover:bg-base-200 hover:text-white"
        //     onClick={() =>
        //       handleNavigate(
        //         navigate,
        //         row.original.document_type,
        //         row.original._id,
        //       )
        //     }
        //   >
        //     <BiSolidEdit />
        //     Edit
        //   </Button>
        //   <Button
        //     variant="destructive"
        //     className="group rounded-full bg-accent-100/10 px-[0.65rem]"
        //     onClick={() => {
        //       setOpen(true);
        //       setSelectedDocument(row.original._id);
        //     }}
        //   >
        //     <MdDelete className="text-accent-100 group-hover:text-white" />
        //   </Button>
        //   <div className="mr-auto"></div>
        // </div>
      },
    },
  ];
};

export default column;
