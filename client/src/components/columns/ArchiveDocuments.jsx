import formatDate from "@/utils/formatDate";
import { Button } from "../ui/button";
import { IoReturnUpForward } from "react-icons/io5";
import { Checkbox } from "../ui/checkbox";

const columns = ({ handleSetSelectedDocument }) => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="border border-secondary-200"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="border border-secondary-200"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "file_name",
    header: "Filename",
    filterFn: "equalsString",
    cell: ({ row }) => (
      <p>
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
    accessorKey: "date_last_modified",
    header: "Date Archived",
    filterFn: "equalsString",
    cell: ({ row }) => formatDate(row.original.date_last_modified),
  },
  {
    accessorKey: "campus_id.campus_name",
    id: "campus_id.campus_name",
    header: "Campus",
    filterFn: "equalsString",
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
    cell: ({ row }) => (
      <div className="grid place-items-center">
        <Button
          className="rounded-full bg-accent-100/15 text-[0.85rem] text-accent-100 shadow-none hover:bg-accent-100 hover:text-white"
          onClick={() => handleSetSelectedDocument(row.original)}
        >
          <IoReturnUpForward /> Unarchive
        </Button>
      </div>
    ),
  },
];

export default columns;
