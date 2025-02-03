// components/columns/ArchiveKeyOfficials.js

import { Button } from "@/components/ui/button";

const keyOfficialsColumns = (columnActions) => [
  {
    accessorKey: "name",
    header: "Name",
    filterFn: "equalsString",
  },
  {
    accessorKey: "position_name",
    header: "Position",
    filterFn: "equalsString",
  },
  {
    accessorKey: "campus_id",
    header: "Campus",
    filterFn: "equalsString",
    cell: ({ row }) => {
      // You can format campus data here if needed
      return row.original.campus_id;
    },
  },
  {
    accessorKey: "date_added",
    header: "Date Archived",
    filterFn: "equalsString",
    cell: ({ row }) => new Date(row.original.date_added).toLocaleDateString(),
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

export default keyOfficialsColumns;