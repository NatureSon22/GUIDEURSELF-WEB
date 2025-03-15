import Layout from "@/components/Layout";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { updateAccount } from "@/api/accounts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RenderField from "@/components/RenderField";
import { Skeleton } from "@/components/ui/skeleton";
import { FaEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";

const formSchema = z
  .object({
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

const PasswordField = ({ isLoading, _id, password }) => {
  const [edit, setEdit] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutateAsync: handleUpdateUserData, isPending } = useMutation({
    mutationFn: updateAccount,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["user"]);
      toast({
        title: "Success",
        description: data.message,
      });
      setEdit(false);
      setShowConfirmPassword(false);
      setShowPassword(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (password) {
      form.setValue("password", password);
    }
  }, [password, form]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("password", data.password);
    formData.append("accountId", _id);
    await handleUpdateUserData(formData);
  };

  const handleCancel = () => {
    setEdit(false);
    setShowConfirmPassword(false);
    setShowPassword(false);
    form.reset({
      password: password || "",
      confirmPassword: "",
    });
  };

  const passwordField = RenderField(
    form,
    "password",
    "Password",
    <Input type={showPassword ? "text" : "password"} readOnly={!edit} />,
  );

  const confirmPasswordField = RenderField(
    form,
    "confirmPassword",
    "Confirm Password",
    <Input type={showConfirmPassword ? "text" : "password"} readOnly={!edit} />,
  );

  return (
    <Layout
      title={"Change Password"}
      subtitle={"Change account password"}
      toggleEditMode={setEdit}
    >
      <Form {...form}>
        <form
          noValidate
          className="grid gap-5"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {isLoading ? (
            <div className="flex flex-wrap gap-4">
              <Skeleton className={"w-[250px] py-5"} />
              <Skeleton className={"w-[250px] py-5"} />
            </div>
          ) : (
            <div
              className={`flex flex-wrap items-start ${edit ? "gap-10" : "gap-7"} `}
            >
              <div
                className={`flex gap-2 ${form.formState.errors.password?.message ? "items-center" : "items-end"} `}
              >
                {passwordField}
                {edit && (
                  <Button
                    variant="ghost"
                    type="button"
                    className="bg-base-300/10 text-secondary-100-75"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <IoEyeSharp /> : <FaEyeSlash />}
                  </Button>
                )}
              </div>

              <div
                className={`flex gap-2 ${form.formState.errors.confirmPassword?.message ? "items-center" : "items-end"} `}
              >
                {confirmPasswordField}
                {edit && (
                  <Button
                    variant="ghost"
                    type="button"
                    className="bg-base-300/10 text-secondary-100-75"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <IoEyeSharp /> : <FaEyeSlash />}
                  </Button>
                )}
              </div>
            </div>
          )}

          {edit && (
            <div className="space-x-4">
              <Button disabled={isPending} type="submit">
                Update
              </Button>
              <Button variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          )}
        </form>
      </Form>
    </Layout>
  );
};

PasswordField.propTypes = {
  isLoading: PropTypes.bool,
  password: PropTypes.string,
  _id: PropTypes.string,
};

export default PasswordField;
