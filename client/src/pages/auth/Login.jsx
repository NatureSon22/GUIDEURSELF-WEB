import { Button } from "../../components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import logo from "../../assets/home-logo.png";
import { login, sendVerificationCode } from "../../api/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import useAuthStore from "../../context/useAuthStore";
import { useState } from "react";
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().default(false),
});

const Login = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const password = searchParams.get("password");

  const navigate = useNavigate();
  const [showPassword, setPassword] = useState(false);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const [error, setError] = useState(null);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email || "",
      password: password || "",
      rememberMe: false,
    },
  });
  const { mutate: handleSendVerification, isPending: isPendingVerification } =
    useMutation({
      mutationFn: ({ email, password }) =>
        sendVerificationCode(email, password),
      onSuccess: (data) => {
        navigate("/email-verification", {
          state: {
            email: form.getValues("email"),
            password: form.getValues("password"),
            verificationCode: data,
            isAuthenticated: true,
          },
        });
        setIsAuthenticated(true);
      },
      onError: (error) => {
        setError(error.message);
      },
    });

  const { mutate: handleLogin, isPending } = useMutation({
    mutationFn: () =>
      login({
        email: form.getValues("email"),
        password: form.getValues("password"),
      }),
    onSuccess: () => {
      // Trigger verification only after successful login
      handleSendVerification({
        email: form.getValues("email"),
        password: form.getValues("password"),
      });
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  return (
    <div className="grid min-h-screen grid-rows-[1fr_auto]">
      <div className="flex items-center justify-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleLogin)}
            noValidate
            className="box-shadow w-full max-w-md space-y-5 rounded-lg p-6 pt-14"
          >
            <div className="mb-8 flex justify-center">
              <img src={logo} alt="GuideURSelf Logo" className="w-[250px]" />
            </div>

            {error ? (
              <p className="rounded-md bg-accent-100/5 px-4 py-5 text-center text-[0.85rem] text-accent-100">
                {error}
              </p>
            ) : (
              <p className="text-center text-[0.9rem] text-gray-600">
                Welcome back! Ready to keep things running smoothly?
              </p>
            )}

            <div className="space-y-4">
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

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="password"
                      className="text-secondary-100/50"
                    >
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-3">
                        <Input
                          id="password"
                          className="py-5"
                          autoComplete="on"
                          type={showPassword ? "text" : "password"}
                          {...field}
                          aria-describedby="passwordHelp"
                        />
                        {!showPassword ? (
                          <FaEyeSlash
                            onClick={() => setPassword(!showPassword)}
                            className="cursor-pointer text-[1.5rem] text-secondary-100/50"
                            aria-label="Show password"
                          />
                        ) : (
                          <IoEyeSharp
                            onClick={() => setPassword(!showPassword)}
                            className="cursor-pointer text-[1.5rem] text-secondary-100/50"
                            aria-label="Hide password"
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center justify-between">
              <Link
                to="/forgot-password"
                className="ml-auto text-sm font-semibold text-base-200 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              className="mt-5 w-full bg-base-200 py-6 text-[1rem] font-semibold"
              disabled={isPending || isPendingVerification}
            >
              {isPending || isPendingVerification ? "Logging in..." : "Login"}
            </Button>
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
    </div>
  );
};

export default Login;
