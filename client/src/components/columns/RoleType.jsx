import formatDate from "@/utils/formatDate";
import { Button } from "@/components/ui/button";
import { BiSolidEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import EditDialog from "@/pages/settings/user-management/EditDialog";

const columns = () => [
  {
    accessorKey: "role_type",
    header: "List of Roles",
    filterFn: "equalsString",
  },
  {
    accessorKey: "date_updated",
    header: "Last Modified",
    cell: ({ row }) => formatDate(row.original.date_added),
    filterFn: "equalsString",
  },
  {
    header: "Action",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-5">
          <div className="ml-auto"></div>
          <EditDialog role_id={row.original._id}>
            <Button
              variant="secondary"
              className="group bg-base-200/10 text-base-200 hover:bg-base-200 hover:text-white"
            >
              <BiSolidEdit />
              Edit
            </Button>
          </EditDialog>

          <Button
            variant="destructive"
            className="group rounded-full bg-accent-100/10 px-[0.65rem]"
          >
            <MdDelete className="text-accent-100 group-hover:text-white" />
          </Button>
          <div className="mr-auto"></div>
        </div>
      );
    },
  },
];

export default columns;
