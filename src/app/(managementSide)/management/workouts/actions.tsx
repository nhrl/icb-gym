import { useState, useRef, useEffect } from "react";
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
import ProgramEditForm from "@/components/mngComponents/programEditForm";
import { Exercise, Program } from "./columns"; // Ensure this import matches your structure
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Define the ProgramActionsProps type
type ProgramActionsProps = {
  program: Program; // Expecting a Program object
  exercisesData: Exercise[]; // Expecting an array of Exercise objects
};

const ProgramActions: React.FC<ProgramActionsProps> = ({ program, exercisesData }) => {
  const [isExercisesPopupOpen, setIsExercisesPopupOpen] = useState(false); // State to control exercises popup
  const [isEditOpen, setIsEditOpen] = useState(false); // State to control edit form modal visibility
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]); // State for selected exercises
  const popupRef = useRef<HTMLDivElement>(null); // Ref for detecting clicks outside the popup

  // Function to open the exercises popup
  const handleOpenExercisesPopup = () => {
    const exercisesForProgram = exercisesData.filter((exercise) => exercise.program_id === program.program_id);
    setSelectedExercises(exercisesForProgram);
    setIsExercisesPopupOpen(true);
  };

  // Function to open the edit form modal
  const handleOpenEditForm = () => {
    setIsEditOpen(true);
  };

  // Function to close the edit form modal
  const handleCloseEditModal = () => {
    setIsEditOpen(false);
  };

  // Close the exercises popup if the user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsExercisesPopupOpen(false);
      }
    };

    if (isExercisesPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExercisesPopupOpen]);

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
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(program.program_id.toString())}>
            Copy Program ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleOpenEditForm}>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenExercisesPopup}>View Exercises</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Popup to display Exercises */}
      {isExercisesPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div
            ref={popupRef}
            className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
          >
            <h2 className="text-xl font-semibold mb-4">Exercises for {program.title}</h2>
            {selectedExercises.length > 0 ? (
              <div className="flex flex-col gap-4">
                {selectedExercises.map((exercise) => (
                  <Card key={exercise.id} className="bg-background border border-border rounded-md w-full sm:w-auto flex-1 mb-4">
                    <CardHeader>
                      <CardTitle>{exercise.name}</CardTitle>
                      <CardDescription>{exercise.desc}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-2 flex flex-row gap-2 items-center">
                        Sets: <Badge variant="outline">{exercise.sets}</Badge>
                      </div>
                      <div className="mb-2 flex flex-row gap-2 items-center">
                        Reps: <Badge variant="outline">{exercise.reps}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-background border border-border rounded-md w-full sm:w-auto flex items-center justify-center p-6">
                <CardHeader>
                  <CardTitle>No Exercises Found</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground">There are no exercises associated with this program.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Modal to show the Edit Form */}
      {isEditOpen && program && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="p-4 max-w-lg w-full bg-white rounded-lg shadow-lg">
            <ProgramEditForm programData={program} onClose={handleCloseEditModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramActions;
