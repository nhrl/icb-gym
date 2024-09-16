"use client";
import React from 'react';
import * as zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import logo from '../assets/logos/logodark.png';

// Define the login form schema
const loginFormSchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(8),
});

export default function LoginModal() {
  const form = useForm<zod.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = (data: zod.infer<typeof loginFormSchema>) => {
    console.log(data); // Handle login data here
  };

  return (
    <div className='bg-[#0a0a0a] text-foreground text-sm rounded-lg shadow-lg md:w-[500px] w-full h-fit p-[64px] border border-zinc-800'>
      <Form {...form} >
        <form onSubmit={form.handleSubmit(handleLogin)} className='gap-4 flex flex-col'>
          
          {/* Logo and Title */}
          <div className='flex flex-col md:flex-row gap-2'>
            <Image src={logo} alt="icblogo" className='inline h-8 w-8' />
          </div>

          <div>
            <FormLabel className='text-xl font-md'>Login to your Account</FormLabel>
            <p className='text-zinc-600 text-[12px]'>Please enter your details below</p>
          </div>

          {/* Email and Password Fields */}
          <div className='flex flex-col gap-2'>
            
            {/* Email Field */}
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

            {/* Password Field */}
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
          </div>

          {/* Form Buttons */}
          <div className='items-center gap-4 flex flex-col'>
            <Button type="submit" className="mt-4 py-2 px-4 rounded w-full flex flex-row gap-2 hover:bg-white hover:text-[#0a0a0a]">
              <ArrowRightEndOnRectangleIcon className="h-4 w-4" />
              Log In
            </Button>
            <FormLabel className='font-thin text-[11px] gap-1 flex flex-row text-zinc-600'>
              Don't have an account? 
              <span className='font-md text-white'> Sign Up </span>
            </FormLabel>
          </div>

        </form>
      </Form>
    </div>
  );
}
