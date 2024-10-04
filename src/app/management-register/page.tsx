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
import { Toast } from "@/components/ui/toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { ArrowUpLeftIcon, BoltIcon } from "@heroicons/react/24/outline"; // Import BoltIcon if needed
import Image from "next/image";
import logo from "@/assets/logos/logodark.png";
import { ToastProvider } from "@radix-ui/react-toast";
import { useToast } from '@/hooks/use-toast'; // Import useToast
import { Toaster } from "@/components/ui/toaster";

// Define the form schema with password confirmation
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
  path: ["confirmPassword"], // Set the error on confirmPassword field
});


// Gender options
const genders = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Prefer not to say", value: "other" },
] as const;

export default function ManagementRegisterForm() {
  const [showToast, setShowToast] = useState(false); // State to show the toast
  const { toast } = useToast(); // Use the toast hook
  const [message, setMessage] = useState('');

  // Set up form validation and state
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

  const handleSubmit = async (data: zod.infer<typeof formSchema>) => {
    const api = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${api}/api/register/manager`, { // Replace with your API endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Sending data as JSON
      },
      body: JSON.stringify(data), // Convert the form data to JSON
    });
    const result = await response.json();
    setMessage(result.message);
    if(result.success) {
      console.log(result.message);
      // Show the toast after successful registration
      setShowToast(true);
      // Hide the toast after a few seconds
      setTimeout(() => setShowToast(false), 3000);
      window.location.href = '/';
    } else {
      console.log(result.message);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
      <div className="relative flex justify-center items-center min-h-screen bg-background overflow-hidden">
        {/* Scrolling Background */}
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
              <h1 className="text-2xl font-bold text-left">
                Register for Management
              </h1>
              <p className="font-regular text-muted-foreground text-sm">
                Please input your details below
              </p>
            </div>
          </div>

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-4"
            >
              {/* First Name and Last Name */}
              <div className="flex flex-col sm:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="firstname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          className="border p-2 w-full rounded"
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.firstname?.message}
                      </FormMessage>
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
                        <Input
                          {...field}
                          type="text"
                          className="border p-2 w-full rounded"
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.lastname?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        className="border p-2 w-full rounded"
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.email?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              {/* Username and Gender */}
              <div className="flex flex-col sm:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          className="border p-2 w-full rounded"
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.username?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Gender</SelectLabel>
                              {genders.map((gender) => (
                                <SelectItem
                                  key={gender.value}
                                  value={gender.value}
                                >
                                  {gender.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.gender?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {/* Password and Confirm Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        className="border p-2 w-full rounded"
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.password?.message}
                    </FormMessage>
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
                      <Input
                        {...field}
                        type="password"
                        className="border p-2 w-full rounded"
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.confirmPassword?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="mt-4 py-2 px-4 rounded w-full flex justify-center gap-2"
              >
                <ArrowUpLeftIcon className="h-4 w-4" />
                Register
              </Button>
            </form>
          </Form>

          {/* Toast Notification */}
          {showToast && (
            <>
              <ToastProvider>
                <Toast>
                  <div className="flex items-center">
                    <p className="text-sm">{message}</p>
                  </div>
                </Toast>
            </ToastProvider>
            <Toaster />
            </>
          )}
        </div>
      </div>
  );
}
