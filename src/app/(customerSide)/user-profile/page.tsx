"use client";

import React, { useEffect, useState } from "react";
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
 
// Example API function to simulate fetching booking data from backend
const fetchBookings = async (): Promise<Booking[]> => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve([
        {
          booking_id: 1,
          customer_id: 101,
          trainer_id: 201,
          payment_status: "Paid",
          confirmation_status: "Confirmed",
          created_at: new Date("2024-10-01"),
        },
        {
          booking_id: 2,
          customer_id: 102,
          trainer_id: 202,
          payment_status: "Unpaid",
          confirmation_status: "Pending",
          created_at: new Date("2024-10-02"),
        },
      ]);
    }, 1000)
  );
};

export default function Page() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast(); // Toast handler

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingsData = await fetchBookings();
        setBookings(bookingsData);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProfileUpdate = (updatedProfile: any) => {
    console.log("Profile updated with:", updatedProfile);
  };

  const handleMembershipSubmit = (data: any) => {
    console.log("Membership registered with:", data);
  };

  if (loading) {
    return <p className="text-center">Loading bookings...</p>;
  }

  return (
    <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Left Column: Membership Card + Data Table */}
      <div className="flex flex-col gap-4">
        {/* Membership Card */}
        <Card className="w-full h-fit">
          <CardHeader className="flex flex-col gap-2">
            <CardTitle className="flex flex-row justify-between items-center">
              <p className="font-medium">Membership</p>
              <CreditCardIcon className="w-5 h-5 text-foreground" />
            </CardTitle>
            <div className="flex flex-row gap-2">
              <CardDescription>Status</CardDescription>
              <Badge variant="success" className="w-fit text-foreground rounded-full">
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4 justify-between">
            <div className="flex flex-row gap-2">
              <p className="text-muted-foreground">Start Date</p>
              <p>June 15, 2024</p>
            </div>
            <p className="font-thin hidden sm:inline">|</p>
            <div className="flex flex-row gap-2">
              <p className="text-muted-foreground">End Date</p>
              <p>June 15, 2024</p>
            </div>
          </CardContent>
          <CardFooter className="w-full justify-end">
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
          </CardFooter>
        </Card>

        {/* Data Table */}
        <div className="p-6 border bg-card rounded-xl h-full w-full overflow-x-auto">
          <DataTable
            columns={columns}
            data={bookings}
            mutate={() => console.log("Bookings refreshed")}
          />
        </div>
      </div>

      {/* Right Column: User Profile */}
      <UserProfile onProfileUpdate={handleProfileUpdate} />

      {/* Toaster Component - Positioned globally */}
      <Toaster />
    </div>
  );
}
