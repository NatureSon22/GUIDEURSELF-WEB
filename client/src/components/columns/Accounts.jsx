import formatDate from "@/utils/formatDate";
import { Button } from "../ui/button";
import { BiEdit } from "react-icons/bi";
import { FaCheckCircle, FaRedoAlt } from "react-icons/fa";
import formatTitle from "@/utils/formatTitle";
import FeaturePermission from "@/layer/FeaturePermission";
import { Checkbox } from "../ui/checkbox";
import { DropdownMenu } from "../ui/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { FaEllipsis } from "react-icons/fa6";
import formatDateTime from "@/utils/formatDateTime";

const handleEditClick = (row, navigate) => {
  navigate(`/accounts/edit-account/${row.original._id}`);
};

const handleVerifyClick = async (accountId, verifyAccount) => {
  await verifyAccount([accountId]);
};

const columns = ({
  navigate,
  handleVerifyAccount,
  hasAction = true,
  isDarkMode = false,
}) => {
  const baseColumns = [];

  // ✅ Correctly Add Checkbox Column Conditionally
  if (hasAction) {
    baseColumns.push({
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
    });
  }

  // ✅ Other Columns
  baseColumns.push(
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
      header: "User Type",
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
      accessorKey: "date_updated",
      header: "Date and Time Modified",
      cell: ({ row }) => formatDateTime(row.original.date_updated),
      filterFn: "dateBetweenFilterFn",
    },
    {
      accessorKey: "status",
      id: "status",
      header: "Status",
      filterFn: "equalsString",
      cell: ({ row }) => {
        const status = row.original.status.toLowerCase();

        const statusColors = {
          active: isDarkMode
            ? "bg-green-500 text-white"
            : "bg-green-200/80 text-green-800",

          inactive: isDarkMode
            ? "bg-gray-600 text-gray-100"
            : "bg-gray-200/80 text-gray-600",

          pending: isDarkMode
            ? "bg-yellow-400 text-gray-700"
            : "bg-yellow-200/80 text-yellow-700",

          blocked: isDarkMode
            ? "bg-red-500 text-white"
            : "bg-red-200/80 text-red-600",
        };

        return (
          <div
            className={`mx-auto w-24 rounded-full py-[7px] text-center text-[0.8rem] font-medium ${
              statusColors[status] || "bg-gray-200 text-gray-700"
            }`}
          >
            <p>{formatTitle(row.original.status)}</p>
          </div>
        );
      },
    },
    // ✅ Hidden `full_name` field combining firstname, middlename, and lastname
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
  );

  // ✅ Add Action Column Conditionally
  if (hasAction) {
    baseColumns.push({
      header: "Action",
      enableHiding: true,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={`mx-4 py-1 ${isDarkMode ? "border-dark-secondary-100-75 bg-dark-base-bg" : ""} `}
              >
                <FaEllipsis />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className={`mt-1 grid w-[135px] gap-1 rounded-md p-3 shadow-md ${isDarkMode ? "border border-dark-text-base-300 bg-dark-base-bg" : "bg-white"} `}
            >
              <FeaturePermission module="Manage Accounts" access="edit account">
                <Button
                  className="bg-base-200/10 text-[0.75rem] text-base-200 shadow-none hover:bg-base-200 hover:text-white"
                  onClick={() => handleEditClick(row, navigate)}
                >
                  <BiEdit />
                  Edit
                </Button>
              </FeaturePermission>

              <FeaturePermission
                module="Manage Accounts"
                access="verify account"
              >
                <Button
                  className={`bg-base-200/10 text-[0.75rem] text-base-200 shadow-none ${
                    row.original.status === "pending" ? "px-[21px]" : ""
                  } hover:bg-base-200 hover:text-white`}
                  onClick={() =>
                    handleVerifyClick(row.original._id, handleVerifyAccount)
                  }
                >
                  {row.original.status === "pending" ? (
                    <FaCheckCircle />
                  ) : (
                    <FaRedoAlt />
                  )}

                  {row.original.status === "pending" ? "Verify" : "Resend"}
                </Button>
              </FeaturePermission>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    });
  }

  return baseColumns;
};

export default columns;
