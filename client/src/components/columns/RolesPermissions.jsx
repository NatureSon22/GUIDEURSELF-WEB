import formatDate from "@/utils/formatDate";
import formatTitle from "@/utils/formatTitle";
import { Button } from "../ui/button";
import { BiEdit } from "react-icons/bi";

const handleEditClick = (navigate, id, role_id) => {
  navigate(`/roles-permissions/edit-assign-role/${id}`, {
    state: { userId: 123, userName: "JohnDoe", roleId: role_id },
  });
};

const columns = ({ navigate }) => [
  {
    accessorKey: "user_number",
    header: "User ID",
    filterFn: "equalsString",
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
    accessorKey: "middlename",
    header: "Middle Name",
  },
  {
    accessorKey: "lastname",
    header: "Last Name",
  },
  {
    accessorKey: "role_type",
    header: "Role Type",
    cell: ({ row }) => formatTitle(row.original.role_type),
    filterFn: "equalsString",
  },
  {
    accessorKey: "campus_name",
    header: "Campus",
    filterFn: "equalsString",
  },
  {
    accessorKey: "date_assigned",
    header: "Date Created",
    cell: ({ row }) => formatDate(row.original.date_assigned),
    filterFn: "equalsString",
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: "equalsString",
  },
  {
    accessorFn: (row) => {
      const { firstname, middlename, lastname } = row;
      return `${firstname || ""} ${middlename || ""} ${lastname || ""}`.trim();
    },
    id: "full_name",
    header: "Full Name",
    filterFn: "fuzzy",
    sortFn: "fuzzySort",
    enableHiding: true,
  },
  {
    header: "Action",
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-around">
          <Button
            className="text-[0.75rem]"
            onClick={() => {
              handleEditClick(navigate, row.original._id, row.original.role_id);
            }}
          >
            <BiEdit />
            Edit
          </Button>
        </div>
      );
    },
  },
];

export default columns;
