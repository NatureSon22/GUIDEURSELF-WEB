import formatDateTime from "@/utils/formatDateTime";
import { Button } from "../ui/button";
import { BiSolidEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

const column = () => [
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
    cell: () => {
      return (
        <div className="flex items-center gap-5">
          <div className="ml-auto"></div>

          <Button
            variant="secondary"
            className="group bg-base-200/10 text-base-200 hover:bg-base-200 hover:text-white"
          >
            <BiSolidEdit />
            Edit
          </Button>

          <Button
            variant="destructive"
            className="group rounded-full bg-accent-100/10 px-[0.65rem]"
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
