import formatDate from "@/utils/formatDate";

const columns = () => [
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
    header: "Action",
  },
  {
    accessorKey: "date_created",
    header: "Date Created",
    cell: ({ row }) => (
      <div className="py-[7px]">
        <p>{formatDate(row.original.date_created)}</p>
      </div>
    ),
    filterFn: "equalsString",
  },
];

export default columns;
