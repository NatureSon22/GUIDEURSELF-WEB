import formatDate from "@/utils/formatDate";
import { Button } from "@/components/ui/button";
import { BiSolidEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
const handleClick = (
  role,
  actionType,
  { setRole, setOpenDialog, setActionType },
) => {
  setRole(role);
  setOpenDialog(true);
  setActionType(actionType);
};

const columns = ({ setRole, setOpenDialog, setActionType }) => [
  {
    accessorKey: "role_type",
    size: 270,
    header: "List of User Type",
    filterFn: "equalsString",
  },
  {
    accessorKey: "date_added",
    header: "Date Added",
    cell: ({ row }) => formatDate(row.original.date_added),
    filterFn: "equalsString",
  },
  {
    header: "Action",
    cell: ({ row }) => {
      const roleData = row.original;
      return (
        <div className="flex items-center justify-center gap-5">
          <Button
            variant="secondary"
            className="group bg-base-200/10 text-base-200 hover:bg-base-200 hover:text-white"
            onClick={() =>
              handleClick(roleData, "edit", {
                setRole,
                setOpenDialog,
                setActionType,
              })
            }
          >
            <BiSolidEdit />
            Edit
          </Button>

          <Button
            variant="destructive"
            className="group rounded-full bg-accent-100/10 px-[0.65rem]"
            onClick={() =>
              handleClick(roleData, "delete", {
                setRole,
                setOpenDialog,
                setActionType,
              })
            }
          >
            <MdDelete className="text-accent-100 group-hover:text-white" />
          </Button>
        </div>
      );
    },
  },
];

export default columns;
