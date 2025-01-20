const column = () => [
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
    accessorKey: "date_and_time",
    header: "Date and Time Created",
    filterFn: "equalsString",
  },
  {
    accessorKey: "contributors",
    header: "Contributor",
    filterFn: "equalsString",
  },
  {
    accessorKey: "date_last_modified",
    header: "Date Last Modified",
    filterFn: "equalsString",
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

export default column;
