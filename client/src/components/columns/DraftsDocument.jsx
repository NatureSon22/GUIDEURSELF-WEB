const column = () => [
  {
    accessorKey: "file_name",
    header: "Filename",
    filterFn: "equalsString",
  },
  {
    accessorKey: "published",
    header: "Published by",
    filterFn: "equalsString",
  },
  {
    accessorKey: "date_time_created",
    header: "Date and Time Created",
    filterFn: "equalsString",
  },
  {
    header: "Action",
  },
];

export default column;
