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
    accessorKey: "date_assigned",
    header: "Date Last Modified",
    cell: ({ row }) => formatDate(row.original.date_updated),
    filterFn: "equalsString",
  },
  {
    accessorKey: "status",
    id: "status",
    header: "Status",
    
          filterFn: "equalsString",
          cell: ({ row }) => {
            const status = row.original.status.toLowerCase();
    
            const statusColors = {
              active: "bg-green-200/80  text-accent-300",
              inactive: "bg-gray-200/80 text-gray-500",
              pending: "bg-yellow-200/80 text-yellow-500",
              blocked: "bg-red-200/80 text-red-500",
            };
    
            return (
              <div
                className={`mx-auto w-24 rounded-full py-[7px] text-center text-[0.8rem] font-medium ${
                  statusColors[status] || "bg-gray-200 text-gray-700"
                }`}
              >
                <p>{formatTitle(row.original.status)}</p>
              </div>
            );
          },
  },
];

export default columns;
