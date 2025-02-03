import {Button} from "@/components/ui/button";

const columns = (columnActions) => [
  {
    accessorKey: "campus_name",
    header: "Campus Name",
    filterFn: "equalsString",
  },
  {
    accessorKey: "date_added", // Assuming this is the field for the archived date
    header: "Date Archived",
    filterFn: "equalsString",
    cell: ({ row }) => new Date(row.original.date_added).toLocaleDateString(), // Format the date
  },
  {
    header: "Action",
    accessorKey: "action",
    cell: ({ row }) => (
      <Button onClick={() => columnActions.handleUnarchive(row.original)}>
        Unarchive
      </Button>
    ),
  },
];

export default columns;