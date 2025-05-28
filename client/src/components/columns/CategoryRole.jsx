import formatDate from "@/utils/formatDate";
import { Button } from "../ui/button";
import { BiSolidEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

const columns = ({ dialog_type, handleOpenDialog }) => [
  {
    accessorKey: "role_type",
    size: 270,
    header: "List of User Type",
    filterFn: "equalsString",
    cell: ({ row }) => (
      <div className="flex items-center gap-4">
        <Button
          className="bg-secondary-100-75 text-[0.8rem]"
          onClick={() => handleOpenDialog(dialog_type.view, row.original)}
        >
          View
        </Button>
        <p>{row.original.role_type}</p>
      </div>
    ),
  },
  {
    accessorKey: "date_updated",
    header: "Last Modified",
    cell: ({ row }) => formatDate(row.original.date_updated),
  },
  {
    header: "Action",
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center gap-5">
          <Button
            variant="secondary"
            className="group bg-base-200/10 text-base-200 hover:bg-base-200 hover:text-white"
            onClick={() => handleOpenDialog(dialog_type.edit, row.original)}
          >
            <BiSolidEdit />
            Edit
          </Button>

          <Button
            variant="destructive"
            className="group rounded-full bg-accent-100/10 px-[0.65rem]"
            onClick={() => handleOpenDialog(dialog_type.delete, row.original)}
          >
            <MdDelete className="text-accent-100 group-hover:text-white" />
          </Button>
        </div>
      );
    },
  },
];

export default columns;
