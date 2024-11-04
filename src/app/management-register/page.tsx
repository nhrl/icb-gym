"use client";
import React, { useState } from "react";
import * as zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { ArrowUpLeftIcon, BoltIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import logo from "@/assets/logos/logodark.png";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

// Define the form schema
const formSchema = zod.object({
  firstname: zod.string().max(25),
  lastname: zod.string().max(25),
  username: zod.string().min(10),
  gender: zod.string().min(1, "Gender is required"),
  email: zod.string().email(),
  password: zod.string().min(8),
  confirmPassword: zod.string().min(8),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Gender options
const genders = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Prefer not to say", value: "other" },
] as const;

export default function ManagementRegisterForm() {
  const [isOtpModal, setIsOtpModal] = useState(false);
  const [storedOtp, setStoredOtp] = useState<string | null>(null);
  const [userInformation, setUserInformation] = useState<any>(null);
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const api = process.env.NEXT_PUBLIC_API_URL;

  // Form setup
  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      username: "",
      gender: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const otpForm = useForm({
    resolver: zodResolver(zod.object({ otp: zod.string().length(6, "OTP must be 6 characters long") })),
    defaultValues: { otp: "" },
  });

  const handleSubmit = async (data: zod.infer<typeof formSchema>) => {
    setUserInformation(data);
    setEmail(data.email);
    // Send OTP
    try {
      const response = await fetch(`${api}/api/register/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      const message = await response.json();
      if (message.success) {
        setStoredOtp(message.otp);
        setIsOtpModal(true);
        toast({
          title: "Signup initiated!",
          description: "An OTP has been sent to your email. Please enter it to complete the registration.",
          duration: 3000,
        });
      } else {
        toast({
          title: "Signup failed!",
          description: message.error || "Something went wrong. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Signup failed!",
        description: "An error occurred. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleOtpSubmit = async (otpData: { otp: string }) => {
    if (storedOtp === otpData.otp) {
      try {
        const response = await fetch(`${api}/api/register/manager`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userInformation),
        });

        const result = await response.json();
        if (result.success) {
          toast({
            title: "Signup successful!",
            description: "Your account has been created.",
            duration: 3000,
          });
          setIsOtpModal(false);
          // Redirect to the root page
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        } else {
          toast({
            title: "Signup failed!",
            description: result.message || "Something went wrong. Please try again.",
            variant: "destructive",
            duration: 3000,
          });
        }
      } catch (error) {
        toast({
          title: "Signup failed!",
          description: "An error occurred. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } else {
      toast({
        title: "Incorrect OTP!",
        description: "The OTP you entered is incorrect. Please check and try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <>
      {isOtpModal ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-background text-foreground text-sm rounded-lg shadow-lg w-fit h-fit p-[64px] border border-border">
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="gap-4 flex flex-col">
                <FormLabel className="text-xl font-md">Enter OTP</FormLabel>
                <p className="text-zinc-600 text-[12px]">Please enter the OTP sent to {email}</p>

                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OTP</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" className="border p-2 w-full rounded" />
                      </FormControl>
                      <FormMessage>{otpForm.formState.errors.otp?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="mt-4 py-2 px-4 rounded w-full">
                  Verify OTP
                </Button>
              </form>
            </Form>
            <Toaster />
          </div>
        </div>
      ) : (
        <div className="relative flex justify-center items-center min-h-screen bg-background overflow-hidden">
          {/* Background Animation */}
          <div className="absolute top-0 left-0 w-full h-full z-0 flex items-center justify-center">
            <div className="font-black text-[64px] md:text-[350px] whitespace-nowrap flex items-center animate-scroll">
              <div className="flex items-center">
                <BoltIcon className="h-[64px] md:h-[300px] fill-yellow-400 stroke-yellow-400" />
                INCREDOBALL
                <BoltIcon className="h-[64px] md:h-[300px] fill-yellow-400 stroke-yellow-400" />
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="relative bg-background shadow-md rounded-lg w-full sm:w-[400px] p-6 border border-border z-10">
            <div className="flex flex-col gap-4 mb-6">
              <Image src={logo} alt="icblogo" className="inline h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold text-left">Register for Management</h1>
                <p className="font-regular text-muted-foreground text-sm">Please input your details below</p>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="firstname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" className="border p-2 w-full rounded" />
                        </FormControl>
                        <FormMessage>{form.formState.errors.firstname?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" className="border p-2 w-full rounded" />
                        </FormControl>
                        <FormMessage>{form.formState.errors.lastname?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </div>

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

                <div className="flex flex-col sm:flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" className="border p-2 w-full rounded" />
                        </FormControl>
                        <FormMessage>{form.formState.errors.username?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a Gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Gender</SelectLabel>
                                {genders.map((gender) => (
                                  <SelectItem key={gender.value} value={gender.value}>
                                    {gender.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage>{form.formState.errors.gender?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </div>

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
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" className="border p-2 w-full rounded" />
                      </FormControl>
                      <FormMessage>{form.formState.errors.confirmPassword?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="mt-4 py-2 px-4 rounded w-full flex justify-center gap-2">
                  <ArrowUpLeftIcon className="h-4 w-4" />
                  Register
                </Button>
              </form>
            </Form>
            <Toaster />
          </div>
        </div>
      )}
    </>
  );
}
