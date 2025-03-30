import { Button } from "@/components/ui/button";
import { IoReturnUpForward } from "react-icons/io5";
import formatDateTime from "@/utils/formatDateTime";
import { Checkbox } from "../ui/checkbox";

const keyOfficialsColumns = (columnActions) => [
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
    accessorKey: "date_added",
    header: "Date Created",
    cell: ({ row }) => formatDateTime(row.original.date_added),
  },
  {
    accessorKey: "date_last_modified",
    header: "Date Archived",
    filterFn: "equalsString",
    cell: ({ row }) => formatDateTime(row.original.date_last_modified),
  },
  {
    header: "Action",
    accessorKey: "action",
    cell: ({ row }) => (
      <div className="grid place-items-center">
      <Button className="rounded-full bg-accent-100/15 text-[0.85rem] text-accent-100 shadow-none hover:bg-accent-100 hover:text-white"
      onClick={() => columnActions.handleUnarchive(row.original)}>
      <IoReturnUpForward/>Unarchive
      </Button>
      </div>
    ),
  },
];

export default keyOfficialsColumns;