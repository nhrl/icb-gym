import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DietplanEditForm from "@/components/mngComponents/dietplanEditForm"; // Make sure to import your form

// Define the Meals type
type Meals = {
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

type DietplanActionsProps = {
  dietplan: any;
  mealsData: Meals[];
};

const DietplanActions: React.FC<DietplanActionsProps> = ({ dietplan, mealsData }) => {
  const [isMealsOpen, setIsMealsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedMeals, setSelectedMeals] = useState<Meals[]>([]);

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
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(dietplan.id.toString())}>
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
                  <p>
                    <strong>Meal:</strong> {meal.meal}
                  </p>
                  <p>
                    <strong>Food:</strong> {meal.food}
                  </p>
                  <p>
                    <strong>Description:</strong> {meal.food_desc}
                  </p>
                  <p>
                    <strong>Protein:</strong> {meal.protein}g
                  </p>
                  <p>
                    <strong>Carbs:</strong> {meal.carbs}g
                  </p>
                  <p>
                    <strong>Fats:</strong> {meal.fats}g
                  </p>
                  <p>
                    <strong>Calories:</strong> {meal.calories}kcal
                  </p>
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
};

export default DietplanActions;
