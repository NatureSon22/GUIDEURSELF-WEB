import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getAccount, updateAccount } from "../../api/accounts";
import { z } from "zod";
import AccountForm from "./AccountForm";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/Loading";

const formSchema = z
  .object({
    userType: z.string().nonempty({ message: "User type is required" }),
    campus: z.string().nonempty({ message: "Campus is required" }),
    user_number: z.string().nonempty({ message: "User number is required" }),
    username: z.string().nonempty({ message: "Username is required" }),
    firstName: z.string().nonempty({ message: "First name is required" }),
    middleName: z.string().optional(),
    lastName: z.string().nonempty({ message: "Last name is required" }),
    email: z
      .string()
      .email({ message: "Invalid email address" })
      .min(1, { message: "Email is required" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    status: z.string().nonempty({ message: "Status is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });

const EditAccount = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    data: accountData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["account", accountId],
    queryFn: () => getAccount(accountId),
    refetchOnMount: true,
  });
  const { mutate: handleEditAccount } = useMutation({
    mutationFn: (data) => updateAccount(data),
    onSuccess: (data) => {
      navigate("/accounts");
      toast({
        title: "Success",
        description: data.message,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) return <Loading />;
  if (error) return <div>Error fetching account data</div>;

  const defaultvalues = {
    _id: accountData?._id || "",
    userType: accountData?.role_id || "",
    campus: accountData?.campus_id || "",
    user_number: accountData?.user_number || "",
    username: accountData?.username || "",
    firstName: accountData?.firstname || "",
    middleName: accountData?.middlename || "",
    lastName: accountData?.lastname || "",
    email: accountData?.email || "",
    password: accountData?.password || "",
    confirmPassword: accountData?.password || "",
    status: accountData?.status || "",
  };

  return (
    <AccountForm
      formSchema={formSchema}
      defaultValues={defaultvalues}
      handleAccountAction={handleEditAccount}
      type="edit"
    />
  );
};

export default EditAccount;
