"use client";
import React from 'react';
import * as zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage, FormLabel, FormControl } from '@/components/ui/form';
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
} from "@/components/ui/select"
import { ArrowUpLeftIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import logo from '../assets/logos/logodark.png';


const formSchema = zod.object({
  firstname: zod.string().max(25),
  lastname: zod.string().max(25),
  username: zod.string().min(10),
  gender: zod.string().min(1, "Gender is required"),
  email: zod.string().email(),
  password: zod.string().min(8),
  confirmPassword: zod.string().min(8),
});

const genders = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Prefer not to say", value: "other" }
] as const;

export default function SignupModal() {
  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      gender: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = (data: zod.infer<typeof formSchema>) => {
    console.log(data); // Handle form data here
  };

  return (
    <div className='bg-[#0a0a0a] text-foreground text-sm rounded-lg shadow-lg w-fit h-fit sm:h-full p-[64px] border border-zinc-800'>
      <Form {...form} >
        <form onSubmit={form.handleSubmit(handleSubmit)} className='gap-4 flex flex-col'>
          
          {/* Logo and Title */}
          <div className='flex flex-col md:flex-row gap-2'>
            <Image src={logo} alt="icblogo" className='inline h-8 w-8' />
          </div>

          <div>
            <FormLabel className='text-xl font-md'>Register your Account</FormLabel>
            <p className='text-zinc-600 text-[12px]'>Please enter your details below</p>
          </div>

          {/* Form Fields */}
          <div className='flex flex-col gap-2'>
            
            {/* First Name and Last Name */}
            <div className='flex flex-row gap-4'>
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
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

            {/* Email, Username, and Gender */}
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

            <div className='flex flex-row gap-4'>
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
                    <FormItem className='flex-1'>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <Select>
                          <SelectTrigger >
                            <SelectValue placeholder="Select a Gender" />
                          </SelectTrigger>
                          <SelectContent className='relative z-[100] '>
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
          <div className='items-center gap-4 flex flex-col'>
            <Button type="submit" className="mt-4 py-2 px-4 rounded w-full flex flex-row gap-2 hover:bg-white hover:text-[#0a0a0a]">
              <ArrowUpLeftIcon className="h-4 w-4" />
              Sign Up
            </Button>
            <FormLabel className='font-thin text-[11px] gap-1 flex flex-row text-zinc-600'>
              Already have an account? 
              <span className='font-md text-white'> Login </span>
            </FormLabel>
          </div>

        </form>
      </Form>
    </div>
  );
}