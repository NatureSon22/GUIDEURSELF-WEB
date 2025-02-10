import {Button} from "@/components/ui/button";
import { IoReturnUpForward } from "react-icons/io5";
import formatDateTime from "@/utils/formatDateTime";

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
    cell: ({ row }) => formatDateTime(row.original.date_added), // Format the date
  },
  {
    header: "Action",
    accessorKey: "action",
    cell: ({ row }) => (
      <Button className="rounded-full bg-accent-100/15 text-[0.85rem] text-accent-100 shadow-none hover:bg-accent-100 hover:text-white"
      onClick={() => columnActions.handleUnarchive(row.original)}>
        <IoReturnUpForward/>Unarchive
      </Button>
    ),
  },
];

export default columns;