import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import logo from "../../assets/home-logo.png";
import { Link, useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import ComboBox from "@/components/ComboBox";
import RenderField from "@/components/RenderField";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaCheckCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { getAllCampuses } from "@/api/component-info";
import { useState } from "react";
import DialogContainer from "@/components/DialogContainer";
import Spinner from "@/components/Spinner";
import { resetPassword } from "@/api/accounts";
import { useToast } from "@/hooks/use-toast";

// Define the schema with an email field
const formSchema = z.object({
  campus: z.string().min(1, { message: "Campus is required" }),
  email: z
    .string()
    .email("Invalid email")
    .min(1, { message: "Email is required" }),
});

const ResendPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      campus: "",
      email: "",
    },
  });

  const { data: allCampuses = [] } = useQuery({
    queryKey: ["campuses"],
    queryFn: getAllCampuses,
  });

  const [open, setOpen] = useState(false);

  const { mutateAsync: handleResetPassword, isPending } = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      setTimeout(() => setOpen(false), 1000);
      form.reset();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    },
  });

  const handleOnSubmit = async (values) => {
    setOpen(true);

    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("campusId", values.campus);

    await handleResetPassword(formData);
  };

  return (
    <div className="grid min-h-screen grid-rows-[1fr_auto]">
      <div className="flex items-center justify-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleOnSubmit)}
            noValidate
            className="box-shadow flex w-full max-w-md flex-col gap-5 rounded-lg p-6 pt-14"
          >
            <div className="mb-8 flex justify-center">
              <img src={logo} alt="GuideURSelf Logo" className="w-[250px]" />
            </div>

            <div className="space-y-4">
              {RenderField(
                form,
                "campus",
                "Select your campus",
                <ComboBox
                  options={allCampuses || []}
                  placeholder="Select your campus"
                  style={{ width: "w-[400px]", py: "py-5" }}
                />,
                { className: "text-secondary-100/50" },
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="email"
                      className="text-secondary-100/50"
                    >
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input id="email" className="py-5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-3">
              <Button
                type="submit"
                className="mt-5 w-full bg-base-200 py-6 text-[1rem] font-semibold"
                disabled={isPending}
              >
                {isPending ? "Processing..." : "Reset Password"}
              </Button>
              <Button
                type="button"
                className="mt-5 w-full border border-base-200 bg-base-200/10 py-6 text-[1rem] font-semibold text-base-200 hover:bg-base-200/10"
                onClick={() => navigate("/login")}
              >
                Back
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <div className="item flex w-full justify-center gap-10 py-4 text-center text-[0.85rem] shadow-top-only">
        <p>&copy; 2024 GuideURSelf. All rights reserved</p>
        <Link to="/legal/terms" className="hover:text-base-200">
          Terms of Service
        </Link>
        <Link to="/legal/privacy" className="hover:text-base-200">
          Privacy Policy
        </Link>
      </div>

      {/* Dialog */}
      <DialogContainer openDialog={open}>
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="flex flex-col items-center space-y-4">
            {isPending ? (
              <Spinner />
            ) : (
              <FaCheckCircle className="text-[3.2rem] text-base-200" />
            )}

            <p className="text-center text-[0.95rem] font-semibold">
              {isPending ? "Sending Password..." : "Password sent"}
            </p>
          </div>

          {!isPending && (
            <p className="text-center text-[0.85rem]">
              Please check the email address associated with your account. We
              have sent your new password.
            </p>
          )}

          {/* {!isPending && (
            <Button
              className="mt-4 border border-base-200 bg-base-200/10 text-base-200 hover:bg-base-200/10"
              onClick={() => setOpen(false)}
            >
              Okay
            </Button>
          )} */}
        </div>
      </DialogContainer>
    </div>
  );
};

export default ResendPassword;
