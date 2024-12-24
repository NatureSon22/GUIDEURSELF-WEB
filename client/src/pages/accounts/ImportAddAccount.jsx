import Header from "@/components/Header";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import RenderField from "@/components/RenderField";
import ComboBox from "@/components/ComboBox";
import { useQuery } from "@tanstack/react-query";
import { getAllCampuses, getAllRoleTypes } from "@/api/component-info";
import ImportField from "./ImportField";

const formSchema = z.object({
  userType: z.string().nonempty({ message: "User type is required" }),
  campus: z.string().nonempty({ message: "Campus is required" }),
});

const ImportAddAccount = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userType: "",
      campus: "",
    },
  });
  const { data: allCampuses } = useQuery({
    queryKey: ["campuses"],
    queryFn: getAllCampuses,
  });
  const { data: allRoleTypes } = useQuery({
    queryKey: ["allRoleTypes"],
    queryFn: getAllRoleTypes,
    refetchOnMount: true,
  });

  const onSubmit = () => {};

  return (
    <Form {...form}>
      <form
        noValidate
        className="grid gap-7"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Header
          title="Import File"
          subtitle={
            'Import a file for bulk account creation, or use "Add Account" option to manually create individual accounts'
          }
        />

        <div className="flex gap-7">
          {RenderField(
            form,
            "userType",
            "User Type",
            <ComboBox options={allRoleTypes} placeholder="Select user type" />,
          )}

          {RenderField(
            form,
            "campus",
            "Campus",
            <ComboBox options={allCampuses} placeholder="Select campus" />,
          )}
        </div>

        <div>
          <ImportField />
        </div>
      </form>
    </Form>
  );
};

export default ImportAddAccount;
