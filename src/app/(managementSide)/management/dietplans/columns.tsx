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

// Define the shape of your data
export type Dietplans = {
  id: number;
  name: string;
  desc: string;
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

// Mock Data for Meals
const mealsData: Meals[] = [
  {
    mealid: 1,
    dietplan_id: 1,
    meal: "Breakfast",
    food: "Oatmeal",
    food_desc: "Oatmeal with fruits and nuts",
    recipe: "Mix oats with milk, add fruits",
    food_prep: "Boil oats, stir fruits",
    protein: 15,
    carbs: 30,
    fats: 10,
    calories: 300,
  },
];

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
        variant="ghostTable"
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
    cell: ({ row }) => <span>{row.original.desc}</span>,
  },
  {
    accessorKey: "fitness_goal",
    header: "Fitness Goal",
    cell: ({ row }) => <span>{row.original.fitness_goal}</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const dietplan = row.original;
      const [isMealsOpen, setIsMealsOpen] = useState(false); // State to control meals modal visibility
      const [isEditOpen, setIsEditOpen] = useState(false); // State to control edit form modal visibility
      const [selectedMeals, setSelectedMeals] = useState<Meals[]>([]); // State for selected meals

      const handleOpenMealsModal = () => {
        const mealsForDietplan = mealsData.filter((meal) => meal.dietplan_id === dietplan.id);
        setSelectedMeals(mealsForDietplan);
        setIsMealsOpen(true);
      };

      const handleOpenEditForm = () => {
        setIsEditOpen(true);
      };

      const handleCloseMealsModal = () => {
        setIsMealsOpen(false);
      };

      const handleCloseEditModal = () => {
        setIsEditOpen(false);
      };

      return (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(row.original.id.toString())}
              >
                Copy Dietplan ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleOpenEditForm}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={handleOpenMealsModal}>View Meals</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Modal to show the Meals */}
          {isMealsOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
              <div className="bg-white rounded-lg shadow-lg p-4 max-w-lg w-full">
                <h2 className="text-xl font-semibold mb-4">Meals for {dietplan.name}</h2>
                <ul className="space-y-2">
                  {selectedMeals.map((meal) => (
                    <li key={meal.mealid} className="border-b pb-2 mb-2">
                      <p><strong>Meal:</strong> {meal.meal}</p>
                      <p><strong>Food:</strong> {meal.food}</p>
                      <p><strong>Description:</strong> {meal.food_desc}</p>
                      <p><strong>Protein:</strong> {meal.protein}g</p>
                      <p><strong>Carbs:</strong> {meal.carbs}g</p>
                      <p><strong>Fats:</strong> {meal.fats}g</p>
                      <p><strong>Calories:</strong> {meal.calories}kcal</p>
                    </li>
                  ))}
                </ul>
                <Button onClick={handleCloseMealsModal} className="mt-4">
                  Close
                </Button>
              </div>
            </div>
          )}

          {/* Modal to show the Edit Form */}
          {isEditOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
              <div className="p-4 max-w-lg w-full">
                <DietplanEditForm />
              </div>
            </div>
          )}
        </div>
      );
    },
  },
];
