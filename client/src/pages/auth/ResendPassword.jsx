import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import logo from "../../assets/home-logo.png";
import { Link, useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import ComboBox from "@/components/ComboBox";
import RenderField from "@/components/RenderField";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  campus: z.string().min(1, { message: "Campus is required" }),
  usernumber: z.string().min(1, { message: "User number is required" }),
});

const ResendPassword = () => {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      campus: "",
      usernumber: "",
    },
  });

  const { data: allCampuses = [], isLoading } = useQuery({
    queryKey: ["campuses"],
    queryFn: () => {},
  });

  const handleOnSubmit = async (values) => {
    console.log("Form submitted with values:", values);

    // Add logic for resending the password, such as calling an API endpoint.
    try {
      // Example API call
      // await resendPasswordAPI(values.email, values.usernumber, values.campus);
      navigate("/password-reset-success"); // Redirect to a success page
    } catch (error) {
      console.error("Error resending password:", error);
      // Handle error, show feedback to the user if needed
    }
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
                  style={{ width: "w-full", py: "py-5" }}
                />,
                { className: "text-secondary-100/50" },
              )}

              <FormField
                control={form.control}
                name="usernumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="usernumber"
                      className="text-secondary-100/50"
                    >
                      User ID
                    </FormLabel>
                    <FormControl>
                      <Input id="usernumber" className="py-5" {...field} />
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
              >
                Resend Password
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
        <Link to="/" className="hover:text-base-200">
          &copy; 2024 GuideURSelf. All rights reserved
        </Link>
        <Link to="/" className="hover:text-base-200">
          Terms of Service
        </Link>
        <Link to="/" className="hover:text-base-200">
          Privacy Policy
        </Link>
      </div>
    </div>
  );
};

export default ResendPassword;
