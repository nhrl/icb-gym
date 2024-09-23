import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { TrashIcon } from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DietplanEditForm from "@/components/mngComponents/dietplanEditForm"; // Make sure to import your form
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isMealsPopupOpen, setIsMealsPopupOpen] = useState(false);
  const [selectedMeals, setSelectedMeals] = useState<Meals[]>([]);
  const popupRef = useRef<HTMLDivElement>(null);

  const handleOpenMealsPopup = () => {
    const mealsForDietplan = mealsData.filter((meal) => meal.dietplan_id === dietplan.id);
    setSelectedMeals(mealsForDietplan);
    setIsMealsPopupOpen(true);
  };

  const handleOpenEditForm = () => {
    setIsEditOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditOpen(false);
  };

  // Close popup if user clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsMealsPopupOpen(false);
      }
    };

    if (isMealsPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMealsPopupOpen]);

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
          <DropdownMenuItem onClick={handleOpenMealsPopup}>View Meals</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Popup to display Meals */}
      {isMealsPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div
            ref={popupRef}
            className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
          >
            <h2 className="text-xl font-semibold mb-4">Meals for {dietplan.name}</h2>
            {selectedMeals.length > 0 ? (
              <div className="flex flex-col gap-4">
                {selectedMeals.map((meal) => (
                  <Card key={meal.mealid} className="bg-background border border-border rounded-md w-full sm:w-auto flex-1 mb-4">
                    <CardHeader>
                      <div className="flex flex-row justify-between items-center">
                        <div>
                          <CardTitle>{meal.meal}</CardTitle>
                          <CardDescription>Calories: {meal.calories} kcal</CardDescription>
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
                                  This action cannot be undone. This will permanently remove the meal from the diet plan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction> {/* Add delete logic here */ }
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
                        <span>Food</span>
                        <Badge variant="outline">{meal.food}</Badge>
                      </div>
                      <div className="mb-2 flex flex-row gap-2 items-center">
                        <span>Description</span>
                        <Badge variant="outline">{meal.food_desc}</Badge>
                      </div>
                      <div className="mb-2 flex flex-row gap-2 items-center">
                        <span>Protein</span>
                        <Badge variant="outline">{meal.protein}g</Badge>
                      </div>
                      <div className="mb-2 flex flex-row gap-2 items-center">
                        <span>Carbs</span>
                        <Badge variant="outline">{meal.carbs}g</Badge>
                      </div>
                      <div className="mb-2 flex flex-row gap-2 items-center">
                        <span>Fats</span>
                        <Badge variant="outline">{meal.fats}g</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-background border border-border rounded-md w-full sm:w-auto flex items-center justify-center p-6">
                <CardHeader>
                  <CardTitle>No Meals Found</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground">
                    There are no meals associated with this diet plan.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Modal to show the Edit Form */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="p-4 max-w-lg w-full">
            <DietplanEditForm dietplanData={dietplan} onClose={handleCloseEditModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DietplanActions;
