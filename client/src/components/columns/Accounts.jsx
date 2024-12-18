import { Button } from "../ui/button";
import { BiEdit } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";

const columns = [
  {
    accessorKey: "user_id",
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
    filterFn: "equalsString",
  },
  {
    accessorKey: "lastname",
    header: "Last Name",
    filterFn: "equalsString",
  },
  {
    accessorKey: "role_type",
    header: "Role Type",
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
    filterFn: (row, columnId, filterValue) => {
      const fullName = row.getValue(columnId);
      return fullName.toLowerCase().includes(filterValue.toLowerCase());
    },
    enableHiding: true
    
  },
  {
    header: "Action",
    cell: () => {
      return (
        <div className="flex items-center justify-around">
          <Button className="text-[0.75rem]">
            <BiEdit />
            Edit
          </Button>
          <Button className="text-[0.75rem]">
            <FaCheckCircle />
            Verify
          </Button>
        </div>
      );
    },
  },
];

export default columns;
