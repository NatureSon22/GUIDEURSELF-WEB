import formatDate from "@/utils/formatDate";

const columns = () => [
  {
    accessorKey: "content",
    header: "Message",
  },
  {
    accessorKey: "date",
    header: "Date Created",
    cell: ({ row }) => (
      <div className="py-[7px]">
        <p>{formatDate(row.original.date)}</p>
      </div>
    ),
    filterFn: "equalsString",
  },
];

export default columns;
