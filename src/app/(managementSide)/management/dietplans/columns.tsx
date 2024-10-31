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
import DietplanEditForm from "@/components/mngComponents/dietplanEditForm"; // Make sure to import your form
import DietplanActions from "./actions"; // Adjust the import path

// Define the shape of your data
export type Dietplans = {
  dietplan_id: number;
  name: string;
  description: string;
  fitness_goal: "Weight Loss" | "Muscle Gain" | "General Health" | "Endurance";
};

export type Meals = {
  mealid: number;
  dietplan_id: number;
  meal: "Breakfast" | "Lunch" | "Dinner";
  food: string;
  food_desc: string;
  recipe: string;
  food_prep: string;
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
};

// Define the columns for your Dietplans table
export const columns: ColumnDef<Dietplans>[] = [
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
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-2 p-0 justify-start"
      >
        Dietplan
        <ArrowsUpDownIcon className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span>{row.original.name}</span>,
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
    id: "actions",
    cell: ({ row }) => <DietplanActions dietplan={row.original} mutate={function (): void {
      throw new Error("Function not implemented.");
    } } />,
  },
];
