"use client";
import React, { useState } from 'react';
import * as zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRightEndOnRectangleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import logo from '../assets/logos/logodark.png';
import SignupModal from './signupModal';
import { Toaster } from "@/components/ui/toaster";
import { useToast } from '@/hooks/use-toast'; // Import Toaster and useToast
import SignupModal from './signupModal'; // Import SignupModal
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js'; // Import the crypto-js library

// Define the login form schema
const loginFormSchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(8),
});

export default function LoginModal() {
  const [isSignupModal, setIsSignupModal] = useState(false); // State to toggle between login and signup
  const { toast } = useToast(); // Use the toast hook from shadcn
  const form = useForm<zod.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const handleLogin = (data: zod.infer<typeof loginFormSchema>) => {
    // Simulating login attempt
    const isLoginSuccessful = false; // Simulate success or failure of login

    if (isLoginSuccessful) {
      // Display the success toast
      toast({
        title: "Login successful!",
        description: "You have successfully logged in.",
        duration: 3000, 
      });
    } else {
      // Display the error (destructive) toast
      toast({
        title: "Login failed!",
        description: "Invalid email or password. Please try again.",
        variant: "destructive", // Destructive variant for error messages
        duration: 3000, 
      });
    }
  };
  const api = process.env.NEXT_PUBLIC_API_URL;
  const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || 'lhS7aOXRUPGPDId6mmHJdA00p39HAfU4';

  const handleLogin = async (data: zod.infer<typeof loginFormSchema>) => {
    const response = await fetch(`${api}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    const result = await response.json();
    const user = result.user;
    const accessToken = result.session.access_token;
  
    if (user && accessToken) {
      // Encrypt the user data and access token
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
  
      // Store encrypted user data in cookies
      Cookies.set('user', encryptedUserData, { expires: 7 });
  
      // Store encrypted access token in cookies
      Cookies.set('access_token', encryptedAccessToken, { expires: 7 });
  
      // Redirect based on role
      if (user.user_metadata.role === 'manager') {
        window.location.href = '/management/account';
      } else if (user.user_metadata.role === 'customer') {
        window.location.href = '/customer/account';
      }
    }
  };
  const handleRefresh = () => {
    window.location.href = '/'; // Change the URL and refresh the page
  };

  // Toggle to show signup modal instead of login modal
  if (isSignupModal) {
    return <SignupModal />;
  }

  return (
    <div className='bg-background text-foreground text-sm rounded-lg shadow-lg md:w-[500px] w-full h-fit p-[64px] border border-border'>
      <Form {...form} >
        <form onSubmit={form.handleSubmit(handleLogin)} className='gap-4 flex flex-col'>
          
          {/* Logo and Title */}
          <div className='flex md:flex-row lg:flex-row sm:flex-col gap-2 w-full items-center justify-between'>
            <Image src={logo} alt="icblogo" className='inline h-8 w-8' />
            <ArrowLeftIcon className="h-6 w-6 cursor-pointer" onClick={handleRefresh} />
          </div>

          <div>
            <FormLabel className='text-xl font-md'>Login to your Account</FormLabel>
            <p className='text-muted-foreground text-[12px]'>Please enter your details below</p>
          </div>

          {/* Email and Password Fields */}
          <div className='flex flex-col gap-2'>
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
          </div>

          {/* Form Buttons */}
          <div className='items-center gap-4 flex flex-col'>
            <Button type="submit" className="mt-4 py-2 px-4 rounded w-full flex flex-row gap-2 hover:bg-white hover:text-[#0a0a0a]">
              <ArrowRightEndOnRectangleIcon className="h-4 w-4" />
              Log In
            </Button>
            <FormLabel className='font-thin text-[11px] gap-1 flex flex-row text-zinc-600'>
              Don&apos;t have an account? 
              <span 
                className='font-md text-white cursor-pointer'
                onClick={() => setIsSignupModal(true)} // Switch to signup modal
              > 
                Sign Up
              </span>
            </FormLabel>
          </div>

        </form>
      </Form>

      <Toaster />
    </div>
  );
}
