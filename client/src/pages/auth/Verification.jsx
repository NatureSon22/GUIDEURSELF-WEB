import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginVerification, sendVerificationCode } from "@/api/auth";

const formSchema = z.object({
  pin: z.string().length(6, { message: "Verification code must be 6 digits." }),
});

const Verification = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { pin: "" },
  });
  const navigate = useNavigate();
  const [time, setTime] = useState(60);
  const [error, setError] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [success, setSuccess] = useState("");

  const location = useLocation();
  const { isAuthenticated = false, email, password } = location.state || {};

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const { mutate: handleVerify, isPending } = useMutation({
    mutationFn: (pin) => loginVerification(email, password, pin),
    onMutate: () => setError(""),
    onSuccess: () => {
      setError("");
      setFailedAttempts(0); // reset on success
      navigate("/dashboard");
    },
    onError: (error) => {
      setFailedAttempts((prev) => prev + 1);
      setError(error.message || "Verification failed. Please try again.");
      console.log("Verification failed:", error.message);
    },
  });

  const { mutate: handleSendVerification, isPending: isPendingVerification } =
    useMutation({
      mutationFn: () => sendVerificationCode(email, password),
      onSuccess: () => {
        setSuccess("A new verification code has been sent to your email.");
        setError("");
        setTimeout(() => {
          setSuccess("");
        }, 2000); // show success message for 5 seconds
      },
      onError: (error) => {
        setError(error.message || "Failed to resend verification code.");
      },
    });

  const onSubmit = (data) => {
    console.log("OTP Submitted:", data.pin);
    handleVerify(data.pin);
  };

  const resend = () => {
    handleSendVerification(email, password);
  };

  useEffect(() => {
    if (failedAttempts === 4) {
      setTime(0);
    }
  }, [failedAttempts]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [time]);

  return (
    <div className="grid min-h-screen grid-rows-[1fr_auto]">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-[470px]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(time === 0 ? () => {} : onSubmit)}
              noValidate
              className="box-shadow w-full space-y-5 rounded-lg p-6 pt-14"
            >
              <div className="mb-8 flex justify-center">
                <img src={logo} alt="GuideURSelf Logo" className="w-[250px]" />
              </div>

              <div
                className={`space-y-8 text-center ${error ? "pb-6 pt-3" : "py-5"}`}
              >
                {success ? (
                  <p className="rounded-md bg-base-200/10 px-10 py-5 text-center text-[0.85rem] text-base-200">
                    {success}
                  </p>
                ) : error ? (
                  <p className="rounded-md bg-accent-100/5 px-10 py-5 text-center text-[0.85rem] text-accent-100">
                    {error}
                  </p>
                ) : (
                  <>
                    <p className="text-[1.3rem] font-semibold">
                      Verify Your Email
                    </p>
                    <p className="px-4 text-[0.85rem]">
                      A verification code has been sent to your email. Please
                      enter it below to proceed.
                    </p>
                  </>
                )}
              </div>

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
                        disabled={failedAttempts < 4 || time === 0}
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
                {(failedAttempts < 4 || time === 0) && (
                  <Button
                    type="submit"
                    className="w-full bg-base-200 py-6 text-[1rem] font-semibold"
                    disabled={isPendingVerification || isPending}
                  >
                    {isPending ? "Verifying..." : "Verify"}
                  </Button>
                )}

                <Button
                  type="button"
                  className="w-full border border-base-200 bg-base-200/10 py-6 text-[0.95rem] font-medium text-base-200 hover:bg-base-200/10"
                  onClick={time === 0 ? () => navigate("/login") : resend}
                  disabled={isPendingVerification || isPending}
                >
                  {time === 0 ? (
                    <p className="font-semibold">Retry login</p>
                  ) : (
                    <>
                      Didn&apos;t receive a code?{" "}
                      <span className="font-semibold">Resend in {time}s</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
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
    </div>
  );
};

export default Verification;
