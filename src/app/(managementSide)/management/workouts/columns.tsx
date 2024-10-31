"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProgramEditForm from "@/components/mngComponents/programEditForm";
import ProgramActions from "./actions"; 

export type Program = {
  program_id: number;
  title: string;
  description: string;
  fitness_level: "Beginner" | "Intermediate" | "Advanced";
  fitness_goal: "Weight Loss" | "Muscle Gain" | "General Health" | "Endurance";
  photoUrl: string;
};

export type Exercise = {
  exercise_id: number;
  program_id: number;
  exercise_name: string;
  exercise_description: string;
  sets: number;
  reps: number;
};

// Define the columns for your Programs table
export const columns: ColumnDef<Program>[] = [
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
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-2 p-0 justify-start"
      >
        Program
        <ArrowsUpDownIcon className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span>{row.original.title}</span>,
  },
  {
    accessorKey: "desc",
    header: "Description",
    cell: ({ row }) => <span>{row.original.description}</span>,
  },
  {
    accessorKey: "fitness_goal",
    header: "Fitness Goal",
    cell: ({ row }) => <span>{row.original.fitness_goal}</span>,
  },
  {
    accessorKey: "fitness_level",
    header: "Fitness Level",
    cell: ({ row }) => <span>{row.original.fitness_level}</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <ProgramActions program={row.original} mutate={function (): void {
        throw new Error("Function not implemented.");
      } }/>
    ),
  },
];
