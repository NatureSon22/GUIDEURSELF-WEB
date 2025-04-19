import formatDate from "@/utils/formatDate";
import formatTitle from "@/utils/formatTitle";
import { Button } from "../ui/button";
import { BiEdit } from "react-icons/bi";

const handleEditClick = (navigate, id, role_id) => {
  navigate(`/user-permissions/edit-permissions/${id}`, {
    state: { roleId: role_id },
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
    id: "role_type",
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
    header: "Date Assigned",
    cell: ({ row }) => formatDate(row.original.date_assigned),
    filterFn: "equalsString",
  },
  // {
  //   accessorKey: "status",
  //   id: "status",
  //   header: "Status",
  //   filterFn: "equalsString",
  //   cell: ({ row }) => {
  //     const status = row.original.status.toLowerCase();

  //     const statusColors = {
  //       active: "bg-green-200/80  text-accent-300",
  //       inactive: "bg-gray-200/80 text-gray-500",
  //       pending: "bg-yellow-200/80 text-yellow-500",
  //       blocked: "bg-red-200/80 text-red-500",
  //     };

  //     return (
  //       <div
  //         className={`mx-auto w-24 rounded-full py-[7px] text-center text-[0.8rem] font-medium ${
  //           statusColors[status] || "bg-gray-200 text-gray-700"
  //         }`}
  //       >
  //         <p>{formatTitle(row.original.status)}</p>
  //       </div>
  //     );
  //   },
  // },
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
            className={
              "bg-base-200/10 text-[0.75rem] text-base-200 shadow-none hover:bg-base-200 hover:text-white"
            }
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
