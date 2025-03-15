import formatTitle from "@/utils/formatTitle";
import formatDate from "@/utils/formatDate";

const column = () => [
  {
    accessorKey: "user_number",
    header: "User ID",
    filterFn: "equalsString",
    cell: ({ row }) => <p className="py-2">{row.original.user_number}</p>,
  },
  {
    accessorKey: "firstname",
    header: "First Name",
  },
  {
    accessorKey: "lastname",
    header: "Last Name",
  },
  {
    accessorKey: "role_type",
    id: "role_type",
    header: "Role Type",
    cell: ({ row }) => formatTitle(row.original.role_type),
    filterFn: "equalsString",
  },
  {
    accessorKey: "campus_name",
    id: "campus_name",
    header: "Campus",
    filterFn: "equalsString",
  },
  {
    accessorKey: "action",
    header: "Action Taken",
    filterFn: "equalsString",
  },
  {
    accessorKey: "date_created",
    header: "Date Created",
    cell: ({ row }) => formatDate(row.original.date_created),
    filterFn: "equalsString",
  },
];

export default column;
