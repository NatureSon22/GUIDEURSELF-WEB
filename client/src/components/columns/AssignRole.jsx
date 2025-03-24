import formatTitle from "@/utils/formatTitle";
import { Checkbox } from "../ui/checkbox";

const columns = () => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox className="border border-secondary-200"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox className="border border-secondary-200"
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
    cell: ({ row }) => <p className="py-2" >{row.original.user_number}</p>,
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
    accessorKey: "campus_name",
    header: "Campus",
    filterFn: "equalsString",
  },
  // {
  //   accessorKey: "status",
  //   id: "status",
  //   header: "Status",
  //   filterFn: "equalsString",
  //   cell: ({ row }) => (
  //     <div className="mx-auto w-24 rounded-full bg-accent-400 py-[7px] text-center text-[0.8rem] font-medium text-accent-300">
  //       <p>{formatTitle(row.original.status)}</p>
  //     </div>
  //   ),
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
];

export default columns;
