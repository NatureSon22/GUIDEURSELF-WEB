import formatDate from "@/utils/formatDate";

const columns = () => [
  {
    accessorKey: "file_name",
    header: "Filename",
    filterFn: "equalsString",
  },
  {
    accessorKey: "published_by",
    header: "Published by",
    filterFn: "equalsString",
  },
  {
    accessorKey: "date_archived",
    header: "Date Archived",
    filterFn: "equalsString",
    cell: ({ row }) => formatDate(row.original.date_archived),
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: "equalsString",
  },
  {
    header: "Action",
  },
];

export default columns;
