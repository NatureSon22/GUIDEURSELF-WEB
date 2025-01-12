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
          <EditDialog role_id={row.original._id}>
            <Button
              variant="secondary"
              className="bg-base-200/10 text-base-200"
            >
              <BiSolidEdit />
              Edit
            </Button>
          </EditDialog>

          <Button variant="destructive">
            <MdDelete />
          </Button>
        </div>
      );
    },
  },
];

export default columns;
