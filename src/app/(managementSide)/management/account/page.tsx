"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useRef, useState } from 'react';
import * as zod from 'zod';
import { useForm } from 'react-hook-form';
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
import { Avatar } from '@/components/ui/avatar';
import { ArrowUpTrayIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import logo from './../../../../assets/logos/logodark.png';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSWR, { mutate } from 'swr';
import CryptoJS from 'crypto-js';


// Define the form schema for personal information
const formSchema = zod.object({
  firstName: zod.string().max(25, "First name must be less than 25 characters"),
  lastName: zod.string().max(25, "Last name must be less than 25 characters"),
  gender: zod.string().min(1, "Gender is required"),
  email: zod.string().email("Invalid email address"),
  username: zod.string().max(25, "Username must be less than 25 characters"),
});

// Gender options
const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

// Define the form schema for password change
const passwordSchema = zod.object({
  currentPassword: zod.string().min(8, "Current password must be at least 8 characters long"),
  newPassword: zod.string().min(8, "New password must be at least 8 characters long"),
  confirmNewPassword: zod.string().min(8, "Confirm new password must be at least 8 characters long"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "New passwords must match",
  path: ["confirmNewPassword"], // The error message will appear here
});

const metadata = {
  title: "User Account",
  description: "Manage your personal information and account details",
};

export default function Page() {
  const [user, setUser] = useState<any>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || 'lhS7aOXRUPGPDId6mmHJdA00p39HAfU4';
  // Initialize the form for personal information
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      gender: '',
      email: '',
      username: '',
    },
  });

  // Initialize the form for password change
  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  // Function to fetch and decrypt user cookie from document.cookie
  const fetchUserFromCookie = () => {
    const cookies = document.cookie.split("; ").reduce((acc: { [key: string]: string }, cookie) => {
      const [name, value] = cookie.split("=");
      acc[name] = value;
      return acc;
    }, {});

    const userCookie = cookies['user']; 

    if (!userCookie) {
      console.error("User cookie not found");
      return null;
    }

    try {
      const decryptedUserBytes = CryptoJS.AES.decrypt(userCookie, secretKey);
      const decryptedUser = JSON.parse(decryptedUserBytes.toString(CryptoJS.enc.Utf8));
      return decryptedUser.id; // Assuming user ID is part of the decrypted data
    } catch (error) {
      console.error("Error decrypting the user cookie", error);
      return null;
    }
  };

  const api = process.env.NEXT_PUBLIC_API_URL;
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  
  const id = fetchUserFromCookie(); // Fetch the user ID from the cookie
  const { data, error } = useSWR(id ? `${api}/api/register/manager?id=${id}` : null, fetcher, {
    revalidateOnFocus: true, // Auto revalidate when window refocuses
  });

  useEffect(() => {
    if (data && data.manager && data.manager.length > 0) {
      const manager = data.manager[0];
      form.reset({
        firstName: manager.firstname || '',
        lastName: manager.lastname || '',
        gender: manager.gender,
        email: manager.email,
        username: manager.username,
      });
      setUser(manager); // Store user data in state if needed
    }
  }, [data, form]);
  
  const handleSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('gender', data.gender);
    formData.append('email', data.email);
    formData.append('username', data.username);

    if(user) {
      formData.append('id', user.manager_id);
    }

    if(selectedPhoto) {
      formData.append('photo',selectedPhoto)
    }

    const response = await fetch(`${api}/api/register/manager`, {
      method: 'PUT',
      body:formData
    })

    const message = await response.json();
    if(message.success) {
      console.log(message.message);
      mutate(`${api}/api/register/manager?id=${user.manager_id}`);
    } else {
      //Error message here
      console.log(message.error);
      console.log(message.message);
    }
  };

  const handlePasswordSubmit = async (data: any) => {
    const requestData = {
      currentPassword: data.currentPassword, // Data from form input (current password)
      newPassword: data.newPassword, // Data from form input (new password)
      hashPassword: user.password,
      id: user.manager_id
    };

    const response = await fetch(`${api}/api/login/resetPassword`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData), // Convert the data to JSON format
    });

    const message = await response.json();
    if(message.success) {
      console.log(message.message);
    } else {
      //display error message here
      console.log(message.message);
    }
  };


  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Programmatically trigger the file input
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Optional chaining in case no file is selected
    if (file) {
      setSelectedPhoto(file);
    }
  };

  const trainerImg = user?.profile_img || 'https://mplhgifjydkvnfsofsoc.supabase.co/storage/v1/object/public/images/trainer/default.jpg';
  return (
    <div className="flex flex-col w-full p-4 bg-muted min-h-screen gap-4">
      {/* Main content */}
      <div className="flex flex-col gap-2 h-full "> {/* Add bottom padding here */}
        <div className='bg-background border border-border flex flex-col justify-between items-center p-8 rounded-lg'>
          {/* Top Content */}
          <div className='flex flex-row items-center justify-between w-full'>
          <Avatar className="h-[36px] w-[36px]">
            <Image
              src={user?.profile_img || trainerImg}
              alt="Profile Picture"
              className='w-full h-full'
              width={24}
              height={24}
              onError={(e) => e.currentTarget.src = trainerImg}
            />
          </Avatar>
          <div className="flex flex-col items-center gap-2">
              <div className="flex flex-row items-center gap-2">
                <Button variant="outline" className="flex flex-row items-center gap-2" onClick={handleButtonClick}>
                  <ArrowUpTrayIcon className="h-4 w-4" />
                  Change Profile Picture
                </Button>
                <input
                  type="file"
                  ref={fileInputRef} // Use useRef to reference the file input
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
              {/* Conditionally render the selected photo name */}
              {selectedPhoto && <p className="text-sm text-black">{selectedPhoto.name}</p>}
            </div>
          </div>
          {/* Personal Information */}
          <div className='w-full mt-8'>
            <h2 className="font-bold text-xl mb-4">Personal Information</h2>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
                {/* First Name, Last Name, and Gender */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* First Name */}
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="First Name" />
                        </FormControl>
                        <FormMessage>{form.formState.errors.firstName?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  {/* Last Name */}
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Last Name" />
                        </FormControl>
                        <FormMessage>{form.formState.errors.lastName?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  {/* Gender */}
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                            <SelectContent>
                              {genderOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage>{form.formState.errors.gender?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Username and Email */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Username */}
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Username" />
                        </FormControl>
                        <FormMessage>{form.formState.errors.username?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Email" type="email" />
                        </FormControl>
                        <FormMessage>{form.formState.errors.email?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end mt-4">
                  <Button variant="secondary"  type="submit" className="w-full sm:w-auto gap-2 flex flex-row">
                    <ArrowPathIcon className='h-4 w-4'/>
                    Update Information
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>

        {/* Password Change */}
        <div className='bg-background border border-border flex flex-col justify-between items-left p-8 rounded-lg'>
          <h2 className="font-bold text-xl mb-4">Password</h2>

          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="flex flex-col gap-4 w-full">
              {/* Current Password */}
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Current Password" type="password" />
                    </FormControl>
                    <FormMessage>{passwordForm.formState.errors.currentPassword?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* New Password */}
              <div className='flex flex-row gap-2 w-full'>
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="New Password" type="password" />
                      </FormControl>
                      <FormMessage>{passwordForm.formState.errors.newPassword?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                {/* Confirm New Password */}
                <FormField
                  control={passwordForm.control}
                  name="confirmNewPassword"
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Confirm New Password" type="password" />
                      </FormControl>
                      <FormMessage>{passwordForm.formState.errors.confirmNewPassword?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button variant="secondary" type="submit" className="w-full sm:w-auto flex flex-row gap-2 mt-4">
                  <ArrowPathIcon className='h-4 w-4'/>
                  Update Password
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}