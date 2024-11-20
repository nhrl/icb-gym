"use client";
import React, { useState } from "react";
import * as zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRightEndOnRectangleIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import logo from "../assets/logos/logodark.png";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import SignupModal from "./signupModal";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

const loginFormSchema = zod.object({
  email: zod.string().email(),
  password: zod
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

interface loginProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: loginProps) {
  const [isSignupModal, setIsSignupModal] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false); // State for popup visibility
  const { toast } = useToast();

  const form = useForm<zod.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const api = process.env.NEXT_PUBLIC_API_URL;
  const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || "lhS7aOXRUPGPDId6mmHJdA00p39HAfU4";

  const handleLogin = async (data: zod.infer<typeof loginFormSchema>) => {
    try {
      const response = await fetch(`${api}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      const user = result.user;
      const accessToken = result.session?.access_token;

      if (user && accessToken) {
        const encryptedUserData = CryptoJS.AES.encrypt(
          JSON.stringify({
            id: user.user_metadata.id,
            role: user.user_metadata.role,
            displayName: user.user_metadata.display_name,
            email: user.email,
          }),
          secretKey
        ).toString();

        const encryptedAccessToken = CryptoJS.AES.encrypt(accessToken, secretKey).toString();

        Cookies.set("user", encryptedUserData, { expires: 7 });
        Cookies.set("access_token", encryptedAccessToken, { expires: 7 });

        toast({
          title: "Login successful!",
          description: "You have successfully logged in.",
          duration: 3000,
        });

        window.location.href = user.user_metadata.role === "manager" ? "/management/account" : "/user-profile";
      } else {
        toast({
          title: "Login failed!",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Login failed!",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleForgotPassword = async () => {
    const email = form.getValues("email");

    if (!email) {
      toast({
        title: "Error!",
        description: "Please enter your email address before clicking 'Forgot Password'.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    try {
      const response = await fetch(`${api}/api/reset-password/send-mail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmEmail: email }),
      });

      const message = await response.json();

      if (message.success) {
        setIsPopupVisible(true); // Show success popup
      } else {
        toast({
          title: "Error!",
          description: "Failed to send reset email. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch {
      toast({
        title: "Error!",
        description: "An error occurred. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <div className="relative bg-background text-foreground text-sm rounded-lg shadow-lg md:w-[500px] w-full h-fit p-[64px] border border-border z-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)} className="gap-4 flex flex-col">
          <div className="flex md:flex-row lg:flex-row sm:flex-col gap-2 w-full items-center justify-between">
            <Image src={logo} alt="icblogo" className="inline h-8 w-8" />
            <ArrowLeftIcon className="h-6 w-6 cursor-pointer" onClick={onClose} />
          </div>

          <div>
            <FormLabel className="text-xl font-md">Login to your Account</FormLabel>
            <p className="text-muted-foreground text-[12px]">Please enter your details below</p>
          </div>

          <div className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" className="border p-2 w-full rounded" />
                  </FormControl>
                  <FormMessage>{form.formState.errors.email?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" className="border p-2 w-full rounded" />
                  </FormControl>
                  <FormMessage>{form.formState.errors.password?.message}</FormMessage>
                </FormItem>
              )}
            />
            <p
              className="p-none w-full flex text-left text-muted-foreground cursor-pointer text-xs"
              onClick={handleForgotPassword} // Trigger forgot password handler
            >
              Forgot Password?
            </p>
          </div>

          <div className="items-center gap-4 flex flex-col">
            <Button
              type="submit"
              className="py-2 px-4 rounded w-full flex flex-row gap-2 hover:bg-primary/90 hover:text-[#0a0a0a]"
              variant="secondary"
            >
              <ArrowRightEndOnRectangleIcon className="h-4 w-4" />
              Log In
            </Button>
            <FormLabel className="font-thin text-[11px] gap-1 flex flex-row text-zinc-600">
              Don&apos;t have an account?
              <span
                className="font-md text-foreground cursor-pointer"
                onClick={() => setIsSignupModal(true)}
              >
                Sign Up
              </span>
            </FormLabel>
          </div>
        </form>
      </Form>

      {/* Forgot Password Success Popup */}
      {isPopupVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background bg-opacity-50 border-border border">
          <div className="bg-background p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold text-foreground">Reset Link Sent</h3>
            <p className="text-sm text-muted-foreground">
              We have sent a password reset link to your email. Please check your inbox.
            </p>
            <Button
              className="mt-4"
              onClick={() => setIsPopupVisible(false)} // Close popup
            >
              Close
            </Button>
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
}
