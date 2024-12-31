import Header from "@/components/Header";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import RenderField from "@/components/RenderField";
import ComboBox from "@/components/ComboBox";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllCampuses, getAllRoleTypes } from "@/api/component-info";
import ImportField from "./ImportField";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { addBulkAccount } from "@/api/accounts";
import ImportDialog from "./ImportDialog";

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

  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [importedUsers, setImportedUsers] = useState([]);

  const { data: allCampuses } = useQuery({
    queryKey: ["campuses"],
    queryFn: getAllCampuses,
  });

  const { data: allRoleTypes } = useQuery({
    queryKey: ["allRoleTypes"],
    queryFn: getAllRoleTypes,
    refetchOnMount: true,
  });

  const { mutateAsync: handleAddBulkAccount, isPending } = useMutation({
    mutationFn: addBulkAccount,
    onMutate: () => setOpenDialog(true),
    onSuccess: () => {
      setTimeout(() => {
        setOpenDialog(false);
        navigate("/accounts");
      }, 1000);
    },
    onError: () => setOpenDialog(false),
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("role_id", data.userType);
    formData.append("campus_id", data.campus);
    formData.append("users", JSON.stringify(importedUsers));
    handleAddBulkAccount(formData);
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

          <div>
            <ImportField
              importedUsers={importedUsers}
              setImportedUsers={setImportedUsers}
            />
          </div>

          <div className="ml-auto space-x-5">
            <Button
              variant="ghost"
              type="button"
              className="text-base-200"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-base-200" disabled={isPending}>
              Import
            </Button>
          </div>
        </form>
      </Form>

      <ImportDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        isPending={isPending}
      />
    </div>
  );
};

export default ImportAddAccount;
