import formatDate from "@/utils/formatDate";
import { Button } from "../ui/button";
import { BiEdit } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";
import formatTitle from "@/utils/formatTitle";
import FeaturePermission from "@/layer/FeaturePermission";

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
    id: "role_type",
    header: "Role Type",
    cell: ({ row }) => formatTitle(row.original.role_type),
    filterFn: "equalsString",
  },
  {
    accessorKey: "campus_name",
    id: "campus_name",
    header: "Campus",
    filterFn: "equalsString",
  },
  {
    accessorKey: "date_created",
    header: "Date Created",
    cell: ({ row }) => formatDate(row.original.date_created),
    filterFn: "dateBetweenFilterFn",
  },
  {
    accessorKey: "status",
    id: "status",
    header: "Status",
    filterFn: "equalsString",
    cell: ({ row }) => (
      <div className="mx-auto w-24 rounded-full bg-accent-400 py-[7px] text-center text-[0.8rem] font-medium text-accent-300">
        <p>{formatTitle(row.original.status)}</p>
      </div>
    ),
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
        <div className="flex items-center justify-around gap-2">
          <FeaturePermission module="Manage Accounts" access="edit account">
            <Button
              className={
                "bg-base-200/10 text-[0.75rem] text-base-200 shadow-none hover:bg-base-200 hover:text-white"
              }
              onClick={() => handleEditClick(row, navigate)}
            >
              <BiEdit />
              Edit
            </Button>
          </FeaturePermission>

          <FeaturePermission module="Manage Accounts" access="verify account">
            <Button
              className={`bg-base-200/10 text-[0.75rem] text-base-200 shadow-none ${row.original.status === "pending" ? "px-5" : ""} hover:bg-base-200 hover:text-white`}
              onClick={() =>
                handleVerifyClick(row.original._id, handleVerifyAccount)
              }
            >
              <FaCheckCircle />
              {row.original.status === "pending" ? "Verify" : "Resend"}
            </Button>
          </FeaturePermission>
        </div>
      );
    },
  },
];

export default columns;
