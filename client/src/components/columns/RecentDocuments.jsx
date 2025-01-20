import formatDateTime from "@/utils/formatDateTime";
import { Link } from "react-router-dom";

const column = () => [
  {
    accessorKey: "file_name",
    header: "Filename",
    filterFn: "equalsString",
    cell: ({ row }) => (
      <Link to={`/documents/view/${row.original._id}`} className="hover:underline" >
        {row.original.file_name}
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
    accessorKey: "status",
    header: "Status",
    filterFn: "equalsString",
  },
];

export default column;
