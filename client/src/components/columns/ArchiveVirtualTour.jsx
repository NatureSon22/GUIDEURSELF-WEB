import { Button } from "@/components/ui/button";
import { IoReturnUpForward } from "react-icons/io5";
import formatDateTime from "@/utils/formatDateTime";

const columns = (columnActions) => [
  {
    accessorKey: "item_name",
    header: "Item Name",
    cell: ({ row }) => {
      const { type, floor_data, location_data } = row.original;
      return type === "floor"
        ? floor_data?.floor_name || "N/A"
        : location_data?.marker_name || "N/A";
    },
  },
  {
    accessorKey: "campus_name",
    header: "Campus",
  },
  {
    accessorKey: "date_archived",
    header: "Date Archived",
    cell: ({ row }) => formatDateTime(row.original.date_archived),
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    header: "Action",
    accessorKey: "action",
    cell: ({ row }) => (
      <Button
        className="rounded-full bg-accent-100/15 text-[0.85rem] text-accent-100 shadow-none hover:bg-accent-100 hover:text-white"
        onClick={() => columnActions.handleUnarchive(row.original._id)}
      >
        <IoReturnUpForward />
        Unarchive
      </Button>
    ),
  },
];

export default columns;