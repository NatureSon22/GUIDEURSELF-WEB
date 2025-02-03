import formatDate from "@/utils/formatDate";
import { Button } from "../ui/button";
import { IoReturnUpForward } from "react-icons/io5";

const columns = () => [
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
    accessorKey: "date_last_modified",
    header: "Date Archived",
    filterFn: "equalsString",
    cell: ({ row }) => formatDate(row.original.date_last_modified),
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
    cell: () => (
      <div className="grid place-items-center">
        <Button className="rounded-full bg-accent-100/15 text-[0.85rem] text-accent-100 shadow-none hover:bg-accent-100 hover:text-white">
          <IoReturnUpForward /> Unarchive
        </Button>
      </div>
    ),
  },
];

export default columns;
