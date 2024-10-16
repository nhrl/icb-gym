"use client";
import React, { useState } from 'react';
import * as zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormMessage, 
  FormLabel, 
  FormControl 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { ArrowUpLeftIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import logo from '../assets/logos/logodark.png';
import LoginModal from './loginModal'; // Import the login modal
import { Toaster } from "@/components/ui/toaster";
import { useToast } from '@/hooks/use-toast'; // Import useToast

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
  path: ["confirmPassword"], // Set the error on confirmPassword field
});

const genders = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Prefer not to say", value: "other" }
] as const;

const api = process.env.NEXT_PUBLIC_API_URL;

export default function SignupModal() {
  const [isLoginModal, setIsLoginModal] = useState(false); // State to switch between modals
  const { toast } = useToast(); // Use the toast hook

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
    try {
      const response = await fetch(`${api}/api/register/customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Signup successful!",
          description: "Your account has been created.",
          duration: 3000,
        });
        setIsLoginModal(true); // Switch to login modal on success
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
  };

  const handleRefresh = () => {
    window.location.href = '/'; // Refresh the page
  };

  // Toggle to show login modal instead of signup modal
  if (isLoginModal) {
    return <LoginModal />;
  }

  return (
    <>
      <div className="bg-background text-foreground text-sm rounded-lg shadow-lg w-fit h-[fit] sm:h-full p-[64px] border border-border">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="gap-4 flex flex-col">

            {/* Logo and Title */}
            <div className="flex md:flex-row lg:flex-row sm:flex-col gap-2 w-full items-center justify-between">
              <Image src={logo} alt="icblogo" className="inline h-8 w-8" />
              <ArrowLeftIcon className="h-6 w-6 cursor-pointer" onClick={handleRefresh} />
            </div>

            <div>
              <FormLabel className="text-xl font-md">Register your Account</FormLabel>
              <p className="text-zinc-600 text-[12px]">Please enter your details below</p>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-4">
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

              <div className="flex flex-row gap-4">
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
                    <FormItem className="flex-1">
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => form.setValue("gender", value)}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Gender" />
                          </SelectTrigger>
                          <SelectContent className="relative z-[400]">
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
            </div>

            {/* Form Buttons */}
            <div className="items-center gap-4 flex flex-col">
              <Button
                type="submit"
                className="mt-4 py-2 px-4 rounded w-full flex flex-row gap-2 hover:bg-white hover:text-[#0a0a0a]"
              >
                <ArrowUpLeftIcon className="h-4 w-4" />
                Sign Up
              </Button>
              <FormLabel className="font-thin text-[11px] gap-1 flex flex-row text-zinc-600">
                Already have an account?
                <span
                  className="font-md text-white cursor-pointer"
                  onClick={() => setIsLoginModal(true)} // Switch to login modal
                >
                  Login
                </span>
              </FormLabel>
            </div>
          </form>
        </Form>

        {/* Toaster component to display toast notifications */}
        <Toaster />
      </div>
    </>
  );
}
