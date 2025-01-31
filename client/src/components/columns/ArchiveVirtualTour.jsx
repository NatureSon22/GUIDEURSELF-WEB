const columns = () => [
  {
    accessorKey: "file_name",
    header: "Filename",
    filterFn: "equalsString",
  },
  {
    accessorKey: "uploaded_by",
    header: "Uploaded by",
    filterFn: "equalsString",
  },
  {
    accessorKey: "campus",
    header: "Campus",
    filterFn: "equalsString",
  },
  {
    accessorKey: "date_archived",
    header: "Date Archived",
    filterFn: "equalsString",
  },
  {
    accessorKey: "type",
    header: "Type",
    filterFn: "equalsString",
  },
  {
    header: "Action",
  },
];

export default columns;
