import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import logo from "../../assets/home-logo.png";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { REGEXP_ONLY_DIGITS } from "input-otp";

const formSchema = z.object({
  pin: z
    .string()
    .length(6, { message: "Your one-time password must be 6 digits." }),
});

const Verification = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { pin: "" },
  });

  const onSubmit = (data) => {
    console.log("OTP Submitted:", data.pin);
    // Add actual OTP verification logic here
  };

  return (
    <div className="grid min-h-screen grid-rows-[1fr_auto]">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-[470px]">
          {/* Wrap the form inside FormProvider */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
              className="box-shadow w-full space-y-5 rounded-lg p-6 pt-14"
            >
              <div className="mb-8 flex justify-center">
                <img src={logo} alt="GuideURSelf Logo" className="w-[250px]" />
              </div>

              <div className="space-y-8 py-5 text-center">
                <p className="text-[1.3rem] font-semibold">Verify Your Email</p>
                <p className="px-4 text-[0.85rem]">
                  A verification code has been sent to your email. Please enter
                  it below to proceed.
                </p>
              </div>

              {/* OTP Input Field */}
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <p className="mb-3 text-[0.85rem] text-secondary-100-75/50">
                      Enter verification code (6-digit code)
                    </p>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        {...field}
                        pattern={REGEXP_ONLY_DIGITS}
                      >
                        <InputOTPGroup className="flex w-full gap-2">
                          {Array.from({ length: 6 }).map((_, index) => (
                            <InputOTPSlot
                              className="flex-1 rounded-md border border-secondary-100-75/30 py-8 text-2xl font-semibold shadow-none"
                              key={index}
                              index={index}
                              inputMode="numeric"
                              pattern="[0-9]*"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2 pt-4">
                <Button
                  type="submit"
                  className="w-full bg-base-200 py-6 text-[1rem] font-semibold"
                >
                  Verify
                </Button>
                <Button
                  type="submit"
                  className="w-full border border-base-200 bg-base-200/10 py-6 text-[0.95rem] font-medium text-base-200 hover:bg-base-200/10"
                >
                  Didn&apos;t receive a code?
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>

      {/* Footer */}
      <div className="item flex w-full justify-center gap-10 py-4 text-center text-[0.85rem] shadow-top-only">
        <p>&copy; 2024 GuideURSelf. All rights reserved</p>
        <Link to="/legal/terms" className="hover:text-base-200">
          Terms of Service
        </Link>
        <Link to="/legal/privacy" className="hover:text-base-200">
          Privacy Policy
        </Link>
      </div>
    </div>
  );
};

export default Verification;
