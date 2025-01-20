import formatTitle from "@/utils/formatTitle";
import formatDate from "@/utils/formatDate";

const column = () => [
  {
    accessorKey: "user_number",
    header: "User ID",
    filterFn: "equalsString",
  },

  {
    accessorKey: "username",
    header: "Username",
    filterFn: "equalsString",
  },
  {
    accessorKey: "email",
    header: "Email",
    filterFn: "equalsString",
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
    accessorKey: "action_taken",
    header: "Action Taken",
    filterFn: "equalsString",
  },
  {
    accessorKey: "date_added",
    header: "Date Added",
    cell: ({ row }) => formatDate(row.original.date_added),
    filterFn: "equalsString",
  },
];

export default column;
