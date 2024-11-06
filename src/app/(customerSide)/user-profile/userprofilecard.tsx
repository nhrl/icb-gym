"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { CameraIcon, CheckIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { useToast } from "@/hooks/use-toast"; // ShadCN toast hook
import CryptoJS from 'crypto-js';
import useSWR, { mutate } from 'swr';

// Zod schema for form validation
const formSchema = zod.object({
  email: zod.string().email({ message: "Invalid email address" }),
  username: zod.string().min(3, "Username must be at least 3 characters"),
  newPassword: zod.string().optional(),
  profile_img: zod.string().optional(),
});

interface UserProfileProps {
  onProfileUpdate: (data: any) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onProfileUpdate }) => {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast(); // Toast handler

  const fetchUserFromCookie = () => {
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || 'lhS7aOXRUPGPDId6mmHJdA00p39HAfU4';
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
  }
  
  const api = process.env.NEXT_PUBLIC_API_URL;
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  
  const id = fetchUserFromCookie(); // Fetch the user ID from the cookie
  const { data } = useSWR(id ? `${api}/api/register/customer?id=${id}` : null, fetcher, {
    revalidateOnFocus: true, // Auto revalidate when window refocuses
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: profileData?.email || "",
      username: profileData?.username || "",
      newPassword: "",
      profile_img: profileData?.profile_img || "",
    },
  });

  const { reset } = form;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (data && data.customer && data.customer.length > 0) {
          const customer = data.customer[0];

          // Transform the fetched data to match the desired structure
          const formattedProfileData = {
            customer_id: customer.customer_id,
            firstname: customer.firstname,
            lastname: customer.lastname,
            gender: customer.gender,
            email: customer.email,
            username: customer.username,
            profile_img: customer.profile_img || '',
            fitnessGoals: ["Weight loss", "Muscle gain", "General health", "Endurance"],
            selectedGoals: JSON.parse(customer.fitness_goals || '[]'),
            timePreference: customer.time_preference,
            fitnessLevel: customer.fitness_level,
          };
          setProfileData(formattedProfileData);
          reset({
            email: formattedProfileData.email,
            username: formattedProfileData.username,
            profile_img: formattedProfileData.profile_img,
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile data.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast, reset, data]); // Added 'toast' to the dependency array

  const onSubmit = async (data: any) => {
    const {
      customer_id = "", 
      selectedGoals = [], 
      fitnessLevel = "", 
      timePreference = "", 
      email = "", 
      username = "", 
      newPassword = "" 
    } = { ...profileData, ...data }; // Merge profileData and form data

    const updatedProfile = {
      customer_id,
      selectedGoals: JSON.stringify(selectedGoals), // Convert array to JSON string
      fitnessLevel,
      timePreference,
      email,
      username,
      newPassword,
    };
    
    const formData = new FormData();
    Object.entries(updatedProfile).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    const response = await fetch(`${api}/api/customer/updateDetails`, {
      method: 'PUT',
      body: formData, // Send as FormData
    });

    const message = await response.json();
    if(message.success) {
      onProfileUpdate(updatedProfile);
   
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('photo',file);
      formData.append('id',profileData.customer_id);
      try {
        const response = await fetch(`${api}/api/customer/uploadProfile`, {
          method: 'PUT',
          body: formData, // Send as FormData
        });
        
        const message = await response.json();
        if(message.success) {
          const imageUrl = URL.createObjectURL(file);
          setProfileData((prev: any) => ({ ...prev, profile_img: imageUrl }));
          toast({
            title: "Profile Picture Updated",
            description: "Your profile picture has been updated successfully.",
          });
        }
      } catch (error) {
        console.error("An error occurred while updating profile picture", error);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleGoalToggle = (goal: string) => {
    setProfileData((prev: any) => ({
      ...prev,
      selectedGoals: prev.selectedGoals.includes(goal)
        ? prev.selectedGoals.filter((g: string) => g !== goal)
        : [...prev.selectedGoals, goal],
    }));
  };

  if (loading) return <p className="text-center">Loading profile...</p>;

  const defaultProfile = profileData?.profile_img || 'https://mplhgifjydkvnfsofsoc.supabase.co/storage/v1/object/public/images/trainer/default.jpg';
  return (
    <div className="w-full h-full">
      <Card className="bg-card">
        <CardHeader className="flex flex-col gap-2">
          <div className="flex items-left flex-col sm:flex-row gap-6 sm:gap-0 justify-between mb-6">
            <div className="flex gap-4">
              <Avatar className="w-20 h-20 relative overflow-hidden rounded-full bg-gray-300">
                {profileData?.profile_img ? (
                  <Image
                    src={defaultProfile}
                    alt="Profile"
                    layout="fill"
                    objectFit="cover"
                  />
                ) : (
                  <AvatarFallback>
                    {profileData?.firstname?.[0] || ""}
                    {profileData?.lastname?.[0] || ""}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <CardTitle className="text-xl font-semibold">
                  {profileData?.firstname || ""} {profileData?.lastname || ""}
                </CardTitle>
                <p className="text-muted-foreground">
                  Customer ID: {profileData?.customer_id || "N/A"}
                </p>
                <p className="text-muted-foreground">{profileData?.gender || "N/A"}</p>
              </div>
            </div>
            <div>
              <Button variant="outline" className="gap-2" onClick={handleUploadClick}>
                <CameraIcon className="h-4 w-4" />
                Upload Profile Picture
              </Button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="font-regular text-sm">Fitness Goals</p>
            <ToggleGroup
              variant="outline"
              type="multiple"
              value={profileData?.selectedGoals}
              onValueChange={(value) =>
                setProfileData((prev: any) => ({ ...prev, selectedGoals: value }))
              }
              className="flex flex-wrap justify-start gap-2"
            >
              {["Weight loss", "Muscle gain", "General health", "Endurance"].map((goal: string) => (
                <ToggleGroupItem
                  key={goal}
                  value={goal}
                  onClick={() => handleGoalToggle(goal)}
                  className="flex items-center gap-2 px-4 py-2 rounded-md border hover:bg-muted-foreground/5 cursor-pointer"
                >
                  {(profileData?.selectedGoals || []).includes(goal) && (
                    <CheckIcon className="h-4 w-4" />
                  )}
                  <span className="whitespace-nowrap">{goal}</span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className="space-y-2">
            <p className="font-regular text-sm">Time Preference</p>
            <ToggleGroup
              variant="outline"
              type="single"
              value={profileData?.timePreference}
              onValueChange={(value) =>
                setProfileData((prev: any) => ({ ...prev, timePreference: value }))
              }
              className="flex gap-2 justify-start"
            >
              {["Morning", "Afternoon", "Evening"].map((time) => (
                <ToggleGroupItem
                  key={time}
                  value={time}
                  className="w-auto flex items-center gap-2 px-4 py-2 rounded-md border hover:bg-muted-foreground/5 cursor-pointer"
                >
                  {profileData?.timePreference === time && (
                    <CheckIcon className="h-4 w-4" />
                  )}
                  <span className="whitespace-nowrap">{time}</span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className="space-y-2">
            <p className="font-regular text-sm">Fitness Level</p>
            <ToggleGroup
              variant="outline"
              type="single"
              value={profileData?.fitnessLevel}
              onValueChange={(value) =>
                setProfileData((prev: any) => ({ ...prev, fitnessLevel: value }))
              }
              className="flex gap-2 justify-start"
            >
              {["Beginner", "Intermediate", "Advanced"].map((level) => (
                <ToggleGroupItem
                  key={level}
                  value={level}
                  className="w-auto flex items-center gap-2 px-4 py-2 rounded-md border hover:bg-muted-foreground/5 cursor-pointer"
                >
                  {profileData?.fitness_level === level && (
                    <CheckIcon className="h-4 w-4" />
                  )}
                  <span className="whitespace-nowrap">{level}</span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-row w-full gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="w-full flex justify-end">
                <Button type="submit" variant="secondary" className="w-fit">
                  <ArrowPathIcon className="h-2 w-2" />
                  Update Profile
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
