import formatTitle from "@/utils/formatTitle";
import formatDate from "@/utils/formatDate";

const column = () => [
  {
    accessorKey: "user_number",
    header: "User ID",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
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
    header: "Role Type",
  },
  {
    accessorKey: "campus_name",
    header: "Campus",
  },
  {
    accessorKey: "rating",
    header: "Rating",
  },
  {
    accessorKey: "comments",
    header: "Comments",
  },
  {
    accessorKey: "date_submitted",
    header: "Date Submitted",
    cell: ({ row }) => formatDate(row.original.date_submitted),
  },
];


export default column;
