import formatDate from "@/utils/formatDate";

const columns = () => [
  {
    accessorKey: "role_type",
    header: "List of User Type",
    filterFn: "equalsString",
  },
  {
    accessorKey: "date_added",
    header: "Date Added",
    cell: ({ row }) => formatDate(row.original.date_added),
    filterFn: "equalsString",
  },
];

export default columns;
