import formatTitle from "@/utils/formatTitle";
import { Button } from "../ui/button";
import { IoReturnUpForward } from "react-icons/io5";
import formatDate from "@/utils/formatDate";
import { Checkbox } from "../ui/checkbox";

const columns = ({ handleSelect }) => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="ml-1 mr-3 border border-secondary-200"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="ml-1 border border-secondary-200"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "user_number",
    header: "User ID",
    filterFn: "equalsString",
    cell: ({ row }) => <p className="py-2">{row.original.user_number}</p>,
  },
  {
    accessorKey: "username",
    header: "Username",
    filterFn: "equalsString",
  },
  {
    accessorKey: "email",
    header: "Email",
    filterFn: "equalsString",
  },
  {
    accessorKey: "firstname",
    header: "First Name",
  },
  {
    accessorKey: "lastname",
    header: "Last Name",
  },
  {
    accessorKey: "role_id.role_type",
    id: "role_id.role_type",
    header: "Role Type",
    cell: ({ row }) =>
      formatTitle(row.original.role_id?.role_type || "No Role"),
    filterFn: "equalsString",
  },
  {
    accessorKey: "campus_name",
    id: "campus_name",
    header: "Campus",
    filterFn: "equalsString",
    cell: ({ row }) => (
      <p className="py-2">
        {row.original?.campus_id?.campus_name || "No Campus Assigned"}
      </p>
    ),
  },
  {
    accessorKey: "date_updated",
    header: "Date Last Modified",
    cell: ({ row }) => (
      <p className="py-2">{formatDate(row.original.date_updated)}</p>
    ),
  },
  {
    header: "Action",
    cell: ({ row }) => (
      <div className="grid place-items-center">
        <Button
          className="rounded-full bg-accent-100/15 text-[0.85rem] text-accent-100 shadow-none hover:bg-accent-100 hover:text-white"
          onClick={() => handleSelect(row.original._id)}
        >
          <IoReturnUpForward /> Unarchive
        </Button>
      </div>
    ),
  },
];

export default columns;
