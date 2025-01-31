const columns = () => [
  {
    accessorKey: "campus_name",
    header: "Campus Name",
    filterFn: "equalsString",
  },
  {
    accessorKey: "added_by",
    header: "Added by",
    filterFn: "equalsString",
  },
  {
    accessorKey: "date_archived",
    header: "Date Archived",
    filterFn: "equalsString",
  },
  {
    header: "Action",
    filterFn: "equalsString",
  },
];

export default columns;
