import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { addAccount } from "@/api/accounts";
import AccountForm from "./AccountForm";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });

const AddAccount = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const defaultValues = {
    user_number: "",
    userType: "",
    campus: "",
    firstName: "",
    username: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const { mutate: handleAddAccount } = useMutation({
    mutationFn: addAccount,
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data.message,
      });
      navigate("/accounts");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  return (
    <AccountForm
      formSchema={formSchema}
      defaultValues={defaultValues}
      handleAccountAction={handleAddAccount}
      type="add"
    />
  );
};

export default AddAccount;
