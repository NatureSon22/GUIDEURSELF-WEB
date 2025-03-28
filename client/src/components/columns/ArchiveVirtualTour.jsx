import { Button } from "@/components/ui/button";
import { IoReturnUpForward } from "react-icons/io5";
import formatDateTime from "@/utils/formatDateTime";
import { Checkbox } from "../ui/checkbox";

const columns = (columnActions) => [
  {
      id: "select",
      header: ({ table }) => (
        <Checkbox className="border border-secondary-200"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox className="border border-secondary-200"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    },
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
    cell: ({ row }) => {
      const item = row.original;
      const itemName = item.type === "floor" 
        ? item.floor_data?.floor_name || "N/A"
        : item.location_data?.marker_name || "N/A";
      
      return (
        <Button
          className="rounded-full bg-accent-100/15 text-[0.85rem] text-accent-100 shadow-none hover:bg-accent-100 hover:text-white"
          onClick={() => columnActions.handleUnarchive(item._id, itemName)}
        >
          <IoReturnUpForward />
          Unarchive
        </Button>
      );
    },
  },
];

export default columns;