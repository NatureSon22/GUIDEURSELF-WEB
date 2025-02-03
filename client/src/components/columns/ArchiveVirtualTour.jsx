import {Button} from "@/components/ui/button";

const columns = (columnActions) => [
  {
    accessorKey: "floor_photo_url",
    header: "Floor",
    filterFn: "equalsString",
  },
  {
    accessorKey: "campus_id.campus_name",
    header: "Campus",
    filterFn: "equalsString",
  },
  {
    accessorKey: "date_archived",
    header: "Date Archived",
    filterFn: "equalsString",
    cell: ({ row }) => new Date(row.original.date_archived).toLocaleDateString(), // Format the date
  },
  {
    accessorKey: "type",
    header: "Type",
    filterFn: "equalsString",
  },
  {
    header: "Action",
    accessorKey: "action",
    cell: ({ row }) => (
      <Button onClick={() => columnActions.handleUnarchive(row.original._id)}>
        Unarchive
      </Button>
    ),
  },
];

export default columns;