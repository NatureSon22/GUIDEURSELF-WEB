import formatDate from "@/utils/formatDate";
import { Button } from "../ui/button";
import { BiEdit } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";
import formatTitle from "@/utils/formatTitle";

const handleEditClick = (row, navigate) => {
  navigate(`/accounts/edit-account/${row.original._id}`);
};

const handleVerifyClick = async (accountId, verifyAccount) => {
  await verifyAccount(accountId);
};

const columns = ({ navigate, handleVerifyAccount }) => [
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
    accessorKey: "date_created",
    header: "Date Created",
    cell: ({ row }) => formatDate(row.original.date_created),
    filterFn: "equalsString",
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: "equalsString",
  },
  // Hidden `full_name` field combining firstname, middlename, and lastname
  {
    accessorFn: (row) => {
      const { firstname, middlename, lastname } = row;
      return `${firstname || ""} ${middlename || ""} ${lastname || ""}`.trim();
    },
    id: "full_name", // Must use `id` since it's a computed column
    header: "Full Name",
    filterFn: "fuzzy",
    sortFn: "fuzzySort",
    // filterFn: (row, columnId, filterValue) => {
    //   const fullName = row.getValue(columnId);
    //   return fullName.toLowerCase().includes(filterValue.toLowerCase());
    // },
    enableHiding: true,
  },
  {
    header: "Action",
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-around">
          <Button
            className="text-[0.75rem]"
            onClick={() => handleEditClick(row, navigate)}
          >
            <BiEdit />
            Edit
          </Button>
          <Button
            className="text-[0.75rem]"
            onClick={() =>
              handleVerifyClick(row.original._id, handleVerifyAccount)
            }
          >
            <FaCheckCircle />
            {row.original.status === "pending" ? "Verify" : "Resend"}
          </Button>
        </div>
      );
    },
  },
];

export default columns;
