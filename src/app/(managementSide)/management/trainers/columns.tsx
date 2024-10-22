"use client";

import Image from "next/image";
import logo from './../../../../assets/logos/logodark.png';
import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useCallback } from "react";

import { TrashIcon } from "@heroicons/react/24/outline";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"; // Ensure these components are imported

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import TrainerActions from "./actions"; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import TrainerEditForm from "@/components/mngComponents/trainerEditForm";
import TrainerAssignForm from "@/components/mngComponents/trainerAssignForm"; // Assignment form for trainers

// Define the shape of your data based on the Trainers type
export type Trainers = {
  trainer_id: number;
  firstname: string;
  lastname: string;
  email: string;
  specialty: string;
  availability: "Available" | "Full";
  trainer_img: string
};

// Define the shape of your data based on the Assignment type
export type Assignment = {
  assign_id: number;
  service_id: number;
  trainer_id: number;
  start_time:string;
  description:string;
  end_time:string;
  schedule: string[];
  max_capacity: number;
  current_capacity: number;
  rate: number;
};

// Define the AssignmentTable component to display assignments
const api = process.env.NEXT_PUBLIC_API_URL;
const AssignmentTable = ({ trainerId }: { trainerId: number }) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignments = useCallback(async () => {
    try {
      const response = await fetch(`${api}/api/manager/trainer/assign?id=${trainerId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch assignments');
      }
      const data = await response.json();
      setAssignments(data.data); // Assuming data is an array of assignments
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  }, [trainerId]); // Trainer ID is the dependency
  
  // Now the effect will only re-run when `trainerId` changes
  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  if (isLoading) return <p>Loading assignments...</p>;
  if (error) return <p>Error: {error}</p>;

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hour, 10));
    date.setMinutes(parseInt(minute, 10));
  
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    };
  
    return date.toLocaleTimeString('en-US', options);
  };

const deleteAssign = async (assign_id: number) => {
  console.log('Assignment ID to delete:', assign_id); // Test this log

  const response = await fetch(`${api}/api/manager/trainer/assign`, { // Replace with your API endpoint
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json', // Sending data as JSON
    },
    body: JSON.stringify({ assign_id }), // Convert the form data to JSON
  });

  const message = await response.json();
  if(message.success) {
    console.log(message.message);
    fetchAssignments();
  } else {
    console.log(message.message);
    console.log(message.error);
  }
};

  return (
    <div>
      {assignments.length > 0 ? (
        <div className="flex flex-col gap-4">
          {assignments.map((assignment) => (
            <Card key={assignment.assign_id} className="bg-background border border-border rounded-md w-full sm:w-auto flex-1">
              <CardHeader>
                <div className="flex flex-row justify-between items-center">
                  <div>
                    <CardTitle>Service ID {assignment.service_id}</CardTitle>
                    <CardDescription>Rate {assignment.rate} PHP</CardDescription>
                  </div>
                 {/* Delete Button */}
                <div>
                    <AlertDialog>
                      <AlertDialogTrigger className="border border-border p-2 rounded-sm hover:bg-muted">
                        <TrashIcon className="h-4 w-4 text-destructive/80" />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure you want to delete this?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently remove your data from the database.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          {/* Pass the assignment's ID to the delete handler */}
                          <AlertDialogAction onClick={() => deleteAssign(assignment.assign_id)}>
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
              <div className="mb-2 flex flex-row gap-2 items-center">
                  Description
                  <Badge variant="outline">
                    {assignment.description}
                  </Badge>
                </div>
                <div className="mb-2 flex flex-row gap-2 items-center">
                  Time Availability
                  <Badge variant="outline">
                    {formatTime(assignment.start_time)} - {formatTime(assignment.end_time)}
                  </Badge>
                </div>
                <div className="mb-2 flex flex-row gap-2 items-center">
                  Schedule
                  <div className="flex flex-wrap gap-2">
                    {assignment.schedule && typeof assignment.schedule === 'string' ? (
                      JSON.parse(assignment.schedule).map((day: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {day}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="outline">No schedule available</Badge>
                    )}
                  </div>
                </div>
                <div className="mb-2 flex flex-row gap-2 items-center">
                  Capacity
                  <div className="flex flex-row gap-2 items-center">
                    <Badge variant="outline">{assignment.current_capacity}</Badge> 
                    of 
                    <Badge variant="outline">{assignment.max_capacity}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-background border border-border rounded-md w-full sm:w-auto flex items-center justify-center p-6">
        <CardHeader>
          <CardTitle>No Assignments Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            There are no assignments for this trainer at the moment.
          </p>
        </CardContent>
      </Card>
      )}
    </div>
  );
};

// Modal for Viewing Trainer Assignments with "click outside to close" functionality
const Modal = ({ onClose, children }: { onClose: () => void; children: React.ReactNode }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose} // Close the modal when clicking outside
    >
      <div
        className="rounded-md w-full max-w-lg"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal content
      >
        {children}
      </div>
    </div>
  );
};

// Define the columns for your Trainers table
export const columns: ColumnDef<Trainers>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "avatar", // New column for Avatar
    header: "Avatar",
    cell: ({ row }) => {
      const trainerImg = row.original.trainer_img || 'https://mplhgifjydkvnfsofsoc.supabase.co/storage/v1/object/public/images/trainer/default.jpg'; // Fallback image if trainer_img is missing
  
      return (
        <Avatar className="h-6 w-6">
          <Image
            src={trainerImg}
            alt={`${row.original.firstname} ${row.original.lastname}`}
            width={24}
            height={24}
            onError={(e) => e.currentTarget.src = '/https://mplhgifjydkvnfsofsoc.supabase.co/storage/v1/object/public/images/trainer/default.jpg'} // Fallback for broken images
          />
        </Avatar>
      );
    },
  },
  {
    accessorKey: "firstName",
    header: "First Name",
    cell: ({ row }) => <span>{row.original.firstname}</span>,
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
    cell: ({ row }) => <span>{row.original.lastname}</span>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghostTable"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-2 p-0 justify-start"
      >
        Email
        <ArrowsUpDownIcon className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span>{row.original.email}</span>,
  },
  {
    accessorKey: "speciality",
    header: "Speciality",
    cell: ({ row }) => <span>{row.original.specialty}</span>,
  },
  {
    accessorKey: "availability",
    header: "Availability",
    cell: ({ row }) => {
      const availability = row.original.availability as string;
      const availabilityToVariantMap: { [key: string]: "success" | "destructive" | "secondary" } = {
        Available: "success",
        Full: "destructive",
      };
      const variant = availabilityToVariantMap[availability] || "secondary";
      const dotColor = variant === "success" ? "bg-green-500" : variant === "destructive" ? "bg-background" : "bg-gray-500";
  
      return (
        <Badge className="rounded-full w-fit flex items-center gap-2" variant={variant}>
          {/* Dot or Circle */}
          <span className={`w-1 h-1 rounded-full ${dotColor}`}></span>
          {availability}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <TrainerActions trainer={row.original} mutate={function (): void {
      throw new Error("Function not implemented.");
    } } />,
  },
];

export { AssignmentTable, Modal };