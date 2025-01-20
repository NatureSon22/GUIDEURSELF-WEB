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
    accessorKey: "rating",
    id: "rating",
    header: "Rating",
    filterFn: "equalsString",
  },
  {
    accessorKey: "comments",
    id: "comments",
    header: "Comments",
  },
  {
    accessorKey: "date_submitted",
    header: "Date Submitted",
    cell: ({ row }) => formatDate(row.original.date_submitted),
    filterFn: "equalsString",
  },
];

export default column;
