import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { getAllCampuses, getAllRoleTypes } from "@/api/component-info";
import { useQuery } from "@tanstack/react-query";
import { Form } from "@/components/ui/form";
import Header from "@/components/Header";
import ComboBox from "@/components/ComboBox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RenderField from "@/components/RenderField";

const AccountForm = ({
  formSchema,
  defaultValues,
  handleAccountAction,
  type,
}) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { ...defaultValues },
  });
  const navigate = useNavigate();
  const { data: allCampuses } = useQuery({
    queryKey: ["allCampuses"],
    queryFn: getAllCampuses,
    refetchOnMount: true,
  });
  const { data: allRoleTypes } = useQuery({
    queryKey: ["allRoleTypes"],
    queryFn: getAllRoleTypes,
    refetchOnMount: true,
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

    handleAccountAction(formData);
  };

  const handleCancel = () => {
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
          {type == "add" ? (
            <Header
              title="Add Account"
              subtitle="Manually create a new account by entering the required information below, or use the Import File option for bulk account creation"
            />
          ) : (
            <Header
              title="Edit Account"
              subtitle="Update information for this account. Make sure that all fields are filled correctly."
            />
          )}

          <div className="space-y-5">
            <div className="flex gap-10">
              {RenderField(
                form,
                "userType",
                "User Type",
                <ComboBox
                  options={allRoleTypes}
                  placeholder="Select user type"
                />,
              )}
              {RenderField(
                form,
                "campus",
                "Campus",
                <ComboBox options={allCampuses} placeholder="Select campus" />,
              )}
            </div>

            <div className="flex gap-10">
              {RenderField(
                form,
                "user_number",
                "User Number",
                <Input placeholder="Enter user number" />,
              )}
              {RenderField(
                form,
                "username",
                "Username",
                <Input placeholder="Enter username" />,
              )}
              {RenderField(
                form,
                "firstName",
                "First Name",
                <Input placeholder="Enter first name" />,
              )}
              {RenderField(
                form,
                "middleName",
                "Middle Name",
                <Input placeholder="Enter middle name" />,
              )}
              {RenderField(
                form,
                "lastName",
                "Last Name",
                <Input placeholder="Enter last name" />,
              )}
            </div>

            <div className="flex gap-10">
              {RenderField(
                form,
                "email",
                "Email",
                <Input placeholder="Enter email" />,
              )}
              {RenderField(
                form,
                "password",
                "Password",
                <Input type="password" placeholder="Enter password" />,
              )}
              {RenderField(
                form,
                "confirmPassword",
                "Confirm Password",
                <Input type="password" placeholder="Confirm password" />,
              )}
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
              {type === "add" ? "Add" : "Update"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

AccountForm.propTypes = {
  formSchema: PropTypes.object.isRequired,
  defaultValues: PropTypes.object.isRequired,
  handleAccountAction: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default AccountForm;
