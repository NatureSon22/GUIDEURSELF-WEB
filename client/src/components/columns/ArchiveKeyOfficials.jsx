const columns = () => [
  {
    accessorKey: "name",
    header: "Name",
    filterFn: "equalsString",
  },
  {
    accessorKey: "administrative_position",
    header: "Administrative Position",
    filterFn: "equalsString",
  },
  {
    accessorKey: "campus_name",
    header: "Campus Name",
    filterFn: "equalsString",
  },
  {
    accessorKey: "date_archived",
    header: "Date Archived",
    filterFn: "equalsString",
  },
  {
    header: "Action",
  },
];

export default columns;
