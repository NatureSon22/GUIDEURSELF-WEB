import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Header from "@/components/Header";
import ComboBox from "@/components/ComboBox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllCampuses, getAllRoleTypes } from "@/api/component-info";
import { addAccount } from "@/api/accounts";
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
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
    },
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: allCampuses } = useQuery({
    queryKey: ["allCampuses"],
    queryFn: () => getAllCampuses(),
    refetchOnMount: true,
  });
  const { data: allRoleTypes } = useQuery({
    queryKey: ["allRoleTypes"],
    queryFn: () => getAllRoleTypes(),
    refetchOnMount: true,
  });
  const { mutate: handleAddAccount } = useMutation({
    mutationFn: (data) => addAccount(data),
    onSuccess: () => {
      navigate("/accounts");
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("role_id", data.userType);
    formData.append("campus_id", data.campus);
    formData.append("user_number", data.user_number);
    formData.append("username", data.username);
    formData.append("firstname", data.firstName);
    formData.append("middlename", data.middleName);
    formData.append("lastname", data.lastName);
    formData.append("email", data.email);
    formData.append("password", data.password);

    handleAddAccount(formData);
  };

  const handleCancel = () => {
    toast({
      title: "Uh oh! Something went wrong.",
      description: "There was a problem with your request.",
    });
    navigate("/accounts");
  };

  return (
    <div>
      <Form {...form}>
        <form
          noValidate
          className="grid gap-7"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Header
            title="Add Account"
            subtitle="Manually create a new account by entering the required information below, or use the Import File option for bulk account creation"
          ></Header>

          <div className="space-y-5">
            <div className="flex gap-10">
              <FormField
                control={form.control}
                name="userType"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel htmlFor="userType">User Type</FormLabel>
                    <FormControl>
                      <ComboBox
                        options={allRoleTypes}
                        placeholder="select user type"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="campus"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel htmlFor="campus">Campus</FormLabel>
                    <FormControl>
                      <ComboBox
                        options={allCampuses}
                        {...field}
                        placeholder="select campus"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-10">
              <FormField
                control={form.control}
                name="user_number"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel htmlFor="user_number">User Number</FormLabel>
                    <FormControl>
                      <Input
                        id="user_number"
                        placeholder="Enter user number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <FormControl>
                      <Input
                        id="username"
                        placeholder="Enter username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel htmlFor="firstName">First Name</FormLabel>
                    <FormControl>
                      <Input
                        id="firstName"
                        {...field}
                        placeholder="Enter first name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="middleName"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel htmlFor="middleName">Middle Name</FormLabel>
                    <FormControl>
                      <Input
                        id="middleName"
                        {...field}
                        placeholder="Enter middle name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel htmlFor="lastName">Last Name</FormLabel>
                    <FormControl>
                      <Input
                        id="lastName"
                        {...field}
                        placeholder="Enter last name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-10">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input id="email" {...field} placeholder="Enter email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <FormControl>
                      <Input
                        id="password"
                        {...field}
                        placeholder="Enter password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel htmlFor="confirmPassword">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="confirmPassword"
                        {...field}
                        placeholder="Confirm password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="ml-auto mt-5 space-x-5">
            <Button
              type="button"
              variant="ghost"
              className="text-base-200"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-base-200">
              Add
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddAccount;
