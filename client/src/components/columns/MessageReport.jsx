import formatDate from "@/utils/formatDate";

const columns = () => [
  // {
  //   accessorKey: "content", // Access content from the message
  //   header: "Message",
  //   cell: ({ row }) => (
  //     <div className="py-2">
  //       <p>{row.original.message.content}</p> {/* Display the user's message */}
  //     </div>
  //   ),
  // },
  {
    accessorKey: "content", // Access content from the response
    header: "Response",
    cell: ({ row }) => (
      <div className="py-2">
        <p>{row.original.content}</p>
        {/* Display the machine's response */}
      </div>
    ),
  },
  {
    accessorKey: "is_helpful", // Access the helpful flag from the response
    header: "Helpful",
    cell: ({ row }) => (
      <div className="min-w-[70px]">
        <p>{row.original.is_helpful ? "Yes" : "No"}</p>{" "}
        {/* Display helpfulness */}
      </div>
    ),
  },
  {
    accessorKey: "date_added", // Access date from the response
    header: "Date Created",
    cell: ({ row }) => (
      <div className="min-w-[120px]">
        <p>{formatDate(row.original.date_added)}</p>{" "}
        {/* Format and display the date */}
      </div>
    ),
    filterFn: "equalsString", // Optional: Ensure filtering works for dates
  },
];

export default columns;