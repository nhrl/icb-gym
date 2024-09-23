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
  firstName: string;
  lastName: string;
  email: string;
  speciality: string;
  availability: "Available" | "Full";
};

// Define the shape of your data based on the Assignment type
export type Assignment = {
  assign_id: number;
  service_id: number;
  trainer_id: number;
  time_availabilty: string;
  schedule: string[];
  max_capacity: number;
  current: number;
  rate: number;
};

// Mockup assignments data
const mockAssignments: Assignment[] = [
  {
    assign_id: 1,
    service_id: 101,
    trainer_id: 1,
    time_availabilty: "9 AM - 11 AM",
    schedule: ["Monday", "Wednesday", "Friday"], // Available days
    max_capacity: 10,
    current: 8,
    rate: 1000,
  },
  {
    assign_id: 2,
    service_id: 102,
    trainer_id: 1,
    time_availabilty: "2 PM - 4 PM",
    schedule: ["Tuesday", "Thursday"], // Available days
    max_capacity: 15,
    current: 12,
    rate: 1500,
  },
  {
    assign_id: 3,
    service_id: 103,
    trainer_id: 2,
    time_availabilty: "6 PM - 8 PM",
    schedule: ["Monday", "Thursday"], // Available days
    max_capacity: 20,
    current: 18,
    rate: 2000,
  },
];

// Define the AssignmentTable component to display assignments
const AssignmentTable = ({ trainerId }: { trainerId: number }) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    // Filter assignments by the trainer's ID
    const filteredAssignments = mockAssignments.filter((assignment) => assignment.trainer_id === trainerId);
    setAssignments(filteredAssignments);
  }, [trainerId]);

  return (
    <div className="p-4">
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
                        <TrashIcon className="h-4 w-4" />
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
                          <AlertDialogAction> {/* Diri ibutang Delete action */ }
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
                  Time Availability
                  <Badge variant="outline">
                    {assignment.time_availabilty}
                  </Badge>
                </div>
                <div className="mb-2 flex flex-row gap-2 items-center">
                  Schedule
                  <div className="flex flex-wrap gap-2">
                    {assignment.schedule.map((day, index) => (
                      <Badge key={index} variant="outline">
                        {day}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="mb-2 flex flex-row gap-2 items-center">
                  Capacity
                  <div className="flex flex-row gap-2 items-center">
                    <Badge variant="outline">{assignment.current}</Badge> 
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
    cell: ({ row }) => (
      <Avatar className="h-6 w-6">
        <Image
          src={logo}
          alt={`${row.original.firstName} ${row.original.lastName}`}
          width={24}
          height={24}
        />
      </Avatar>
    ),
  },
  {
    accessorKey: "firstName",
    header: "First Name",
    cell: ({ row }) => <span>{row.original.firstName}</span>,
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
    cell: ({ row }) => <span>{row.original.lastName}</span>,
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
    cell: ({ row }) => <span>{row.original.speciality}</span>,
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
      return (
        <Badge className="rounded-full" variant={variant}>
          {availability}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <TrainerActions trainer={row.original} />,
  },
];

export { AssignmentTable, Modal };