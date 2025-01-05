import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import RenderField from "@/components/RenderField";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { updateAccount } from "@/api/accounts";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  firstName: z.string().nonempty({ message: "First name is required" }),
  middleName: z.string().optional(),
  lastName: z.string().nonempty({ message: "Last name is required" }),
  user_number: z.string().nonempty({ message: "User number is required" }),
  username: z.string().nonempty({ message: "Username is required" }),
});

const InformationField = ({
  isLoading,
  firstname,
  middlename,
  lastname,
  user_number,
  username,
  _id,
}) => {
  const [edit, setEdit] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      user_number: "",
      username: "",
    },
  });
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
    if (firstname) form.setValue("firstName", firstname);
    if (middlename) form.setValue("middleName", middlename);
    if (lastname) form.setValue("lastName", lastname);
    if (user_number) form.setValue("user_number", user_number);
    if (username) form.setValue("username", username);
  }, [firstname, middlename, lastname, user_number, username, form]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("firstname", data.firstName);
    formData.append("middlename", data.middleName);
    formData.append("lastname", data.lastName);
    formData.append("username", data.username);
    formData.append("accountId", _id);
    handleUpdateUserData(formData);
  };

  const handleCancel = () => {
    setEdit(false);
  };

  return (
    <Layout
      title="Account Information"
      subtitle="Update user account information"
      toggleEditMode={setEdit}
    >
      <Form {...form}>
        <form
          noValidate
          className="grid gap-5"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {isLoading ? (
            <div className="space-y-5">
              <Skeleton className={"w-[200px] py-5"} />

              <Skeleton className={"w-[200px] py-5"} />

              <div className="flex flex-wrap gap-4">
                <Skeleton className={"w-[200px] py-5"} />
                <Skeleton className={"w-[200px] py-5"} />
                <Skeleton className={"w-[200px] py-5"} />
              </div>
            </div>
          ) : (
            <>
              {RenderField(
                form,
                "user_number",
                "User Number",
                <Input
                  disabled={true}
                  className="w-min bg-secondary-200/30 font-medium"
                />,
              )}

              {RenderField(
                form,
                "username",
                "Username",
                <Input readOnly={!edit} className="w-min" />,
              )}

              <div className="flex flex-wrap items-start gap-7">
                {RenderField(
                  form,
                  "firstName",
                  "First Name",
                  <Input readOnly={!edit} />,
                )}
                {RenderField(
                  form,
                  "middleName",
                  "Middle Name",
                  <Input readOnly={!edit} />,
                )}
                {RenderField(
                  form,
                  "lastName",
                  "Last Name",
                  <Input readOnly={!edit} />,
                )}
              </div>

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
            </>
          )}
        </form>
      </Form>
    </Layout>
  );
};

InformationField.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  _id: PropTypes.string,
  firstname: PropTypes.string,
  middlename: PropTypes.string,
  lastname: PropTypes.string,
  user_number: PropTypes.string,
  username: PropTypes.string,
};

export default InformationField;
