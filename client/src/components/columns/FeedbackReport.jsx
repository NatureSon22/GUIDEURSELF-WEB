import formatDate from "@/utils/formatDate";

const column = () => [
  {
    accessorKey: "user_number",
    header: "User ID",
    cell: ({ row }) => <p className="py-2">{row.original.user_number}</p>,
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
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
    accessorKey: "role_type",
    header: "Role Type",
  },
  {
    accessorKey: "campus_name",
    header: "Campus",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original?.type ?? "Mobile App";
      return <p>{type}</p>;
    },
  },
  {
    accessorKey: "rating",
    header: "Rating",
  },
  {
    accessorKey: "comments",
    header: "Comments",
    cell: ({ row }) => {
      const comment =
        row.original.comments.length > 40
          ? row.original.comments[0].toUpperCase() +
            row.original.comments.substr(1, 40) +
            "..."
          : row.original.comments;
      return <p className="py-2">{comment}</p>;
    },
  },
  {
    accessorKey: "date_submitted",
    header: "Date Submitted",
    cell: ({ row }) => formatDate(row.original.date_submitted),
  },
];

export default column;