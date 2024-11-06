"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "@/assets/logos/logodark.png";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCardIcon } from "@heroicons/react/24/outline";
import { DataTable } from "./datatable";
import { Booking, columns } from "./columns";
import { UserProfile } from "./userprofilecard";
import MembershipForm from "@/components/customerComponents/membershipForm"; 
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/toaster"; // Import toaster
import { useToast } from "@/hooks/use-toast";
import CryptoJS from 'crypto-js';
import { CodeSandboxLogoIcon } from "@radix-ui/react-icons";
import useSWR, { mutate } from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [membership, setMembership] = useState<any>(null); // Store user's membership
  const { toast } = useToast(); // Toast handler
  // Fetch user from cookie

const fetchUserFromCookie = () => {
    if (typeof window === "undefined") return null; // Prevent running on server
      const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || "lhS7aOXRUPGPDId6mmHJdA00p39HAfU4";
      const cookies = document.cookie.split("; ").reduce((acc: { [key: string]: string }, cookie) => {
      const [name, value] = cookie.split("=");
      acc[name] = value;
      return acc;
    }, {});
  
    const userCookie = cookies["user"];
    if (!userCookie) return null;
  
    try {
      const decryptedUserBytes = CryptoJS.AES.decrypt(userCookie, secretKey);
      const decryptedUser = JSON.parse(decryptedUserBytes.toString(CryptoJS.enc.Utf8));
      return decryptedUser.id;
    } catch (error) {
      console.error("Error decrypting user cookie:", error);
      return null;
    }
};

const userId = fetchUserFromCookie(); // Fetch user ID from cookie
const api = process.env.NEXT_PUBLIC_API_URL;

const { data: bookingData, mutate, error } = useSWR(
    `${api}/api/customer/booking?id=${userId}`,
    fetcher,
    { revalidateOnFocus: true }
  );

  const bookings = bookingData?.data || [];
  useEffect(() => {
    const fetchUserMembership = async (userId: number) => {
      try {
        const response = await fetch(`${api}/api/customer/membership?id=${userId}`);
        const result = await response.json();
        setMembership(result.membership);
      } catch (error) {
        console.error("Error fetching user membership:", error);
      }
    };
  
    const fetchData = async () => {
      try {
        if (userId) {
          await fetchUserMembership(userId);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [userId, api]);

  const handleProfileUpdate = (updatedProfile: any) => {
    console.log("Profile updated with:", updatedProfile);
  };

  const handleMembershipSubmit = (data: any) => {
    console.log("Membership registered with:", data);
  };

  if (loading) {
    return <p className="text-center">Loading bookings...</p>;
  }

  // Check if user has an active or pending membership
  const disableRegistration = membership && ["Pending", "Active"].includes(membership.status);
  const membershipStatus = membership?.status || "None";

  return (
    <div className="p-4 px-4 sm:px-[128px] gap-4 flex flex-col">
    {/* Breadcrumb */}
    <div className="w-full h-fit">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/user-profile">User Profile</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>

    <div className="flex flex-col sm:flex-row md:flex-row gap-4">
      {/* Left Column: Membership Card + Data Table */}
      <div className="flex flex-col gap-4">
        {/* Membership Card */}
        <Card className="w-full h-fit membershipcard-bg">
          <CardHeader className="flex flex-col gap-2">
            <CardTitle className="flex flex-row justify-between items-center">
              <p className="font-semibold text-3xl italic">Membership</p>
              <Image src={logo} alt="icblogo" className="h-7 w-7" priority />
            </CardTitle>
            <div className="flex flex-row gap-2">
              <CardDescription>Status</CardDescription>
              <Badge
                variant={
                  membershipStatus === "Active"
                    ? "success"
                    :  membershipStatus === "Pending"
                    ? "pending"
                    : "destructive"
                }
                className="w-fit rounded-full"
              >
                { membershipStatus }
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4 justify-between">
            <div className="flex flex-row gap-2">
              <p className="text-muted-foreground">Start Date</p>
              <p>{membership?.date_start ? new Date(membership?.date_start ).toDateString() : "Not yet started"}</p>
            </div>
            <p className="font-thin hidden sm:inline">|</p>
            <div className="flex flex-row gap-2">
              <p className="text-muted-foreground">End Date</p>
              <p>{membership?.date_end ? new Date(membership?.date_end).toDateString() : "Not available"}</p>
            </div>
          </CardContent>
          <CardFooter className="w-full justify-end">
            {disableRegistration ? (
              <p className="text-muted-foreground">
                You already have an {membership.status} membership.
              </p>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Register Membership</Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg mx-auto">
                  <DialogHeader>
                    <DialogTitle>Register Membership</DialogTitle>
                  </DialogHeader>
                  <MembershipForm onSubmit={handleMembershipSubmit} />
                </DialogContent>
              </Dialog>
            )}
          </CardFooter>
        </Card>

        {/* Data Table */}
        <div className="p-6 border bg-card rounded-xl h-full w-full overflow-x-auto">
          <DataTable
            columns={columns}
            data={bookings}
            mutate={mutate}
          />
        </div>
      </div>

      {/* Right Column: User Profile */}
      <div className="w-full">
        <UserProfile onProfileUpdate={handleProfileUpdate} />
      </div>
      {/* Toaster Component - Positioned globally */}
      <Toaster />
    </div>
    </div>
  );
}
