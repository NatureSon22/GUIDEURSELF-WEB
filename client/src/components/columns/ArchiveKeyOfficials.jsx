import { Button } from "@/components/ui/button";
import { IoReturnUpForward } from "react-icons/io5";
import formatDateTime from "@/utils/formatDateTime";


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
  // {
  //   accessorKey: "campus_id",
  //   header: "Campus",
  //   filterFn: "equalsString",
  //   cell: ({ row }) => {
  //     // You can format campus data here if needed
  //     return row.original.campus_id;
  // //   },
  // },
  {
    accessorKey: "date_added",
    header: "Date Archived",
    filterFn: "equalsString",
    cell: ({ row }) => formatDateTime(row.original.date_added),
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