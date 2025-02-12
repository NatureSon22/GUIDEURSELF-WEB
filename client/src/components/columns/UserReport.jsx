import formatDate from "@/utils/formatDate";
import formatTitle from "@/utils/formatTitle";

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
    id: "campus_name", // This should match the `id` in the filter
    header: "Campus",
    filterFn: "equalsString",
  },
  {
    accessorKey: "date_created",
    header: "Date Created",
    cell: ({ row }) => formatDate(row.original.date_created),
    filterFn: "equalsString",
  },
  {
    accessorKey: "status",
    id: "status",
    header: "Status",
    filterFn: "equalsString",
    cell: ({ row }) => (
      <div className="w-24 rounded-full bg-accent-400 py-[7px] text-center text-[0.8rem] font-medium text-accent-300">
        <p>{formatTitle(row.original.status)}</p>
      </div>
    ),
  },
  {
    accessorFn: (row) => {
      const { firstname, middlename, lastname } = row;
      return `${firstname || ""} ${middlename || ""} ${lastname || ""}`.trim();
    },
    id: "full_name",
    header: "Full Name",
    filterFn: "fuzzy",
    sortFn: "fuzzySort",
    enableHiding: true,
  },
];

export default columns;
