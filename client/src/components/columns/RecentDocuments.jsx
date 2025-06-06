import formatDateTime from "@/utils/formatDateTime";
import formatTitle from "@/utils/formatTitle";
import { Link } from "react-router-dom";

const column = ({ isDarkMode }) => [
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
          ? row.original.file_name.slice(0, 40) + "..."
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
    accessorKey: "type",
    header: "State",
    filterFn: "equalsString",
    cell: ({ row }) => formatTitle(row.original.type),
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
];

export default column;
