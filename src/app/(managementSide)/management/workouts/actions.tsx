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
import ProgramEditForm from "@/components/mngComponents/programEditForm";
import { Exercise, Program } from "./columns"; // Adjust this import according to your project structure

type ProgramActionsProps = {
  program: Program;
  exercisesData: Exercise[];
};

const ProgramActions: React.FC<ProgramActionsProps> = ({ program, exercisesData }) => {
  const [isExercisesOpen, setIsExercisesOpen] = useState(false); // State to control exercises modal visibility
  const [isEditOpen, setIsEditOpen] = useState(false); // State to control edit form modal visibility
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]); // State for selected exercises

  const handleOpenExercisesModal = () => {
    const exercisesForProgram = exercisesData.filter((exercise) => exercise.program_id === program.program_id);
    setSelectedExercises(exercisesForProgram);
    setIsExercisesOpen(true);
  };

  const handleOpenEditForm = () => {
    setIsEditOpen(true);
  };

  const handleCloseExercisesModal = () => {
    setIsExercisesOpen(false);
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
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(program.program_id.toString())}>
            Copy Program ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleOpenEditForm}>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenExercisesModal}>View Exercises</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal to show the Exercises */}
      {isExercisesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-4">Exercises for {program.title}</h2>
            <ul className="space-y-2">
              {selectedExercises.map((exercise) => (
                <li key={exercise.id} className="border-b pb-2 mb-2">
                  <p><strong>Exercise:</strong> {exercise.name}</p>
                  <p><strong>Description:</strong> {exercise.desc}</p>
                  <p><strong>Sets:</strong> {exercise.sets}</p>
                  <p><strong>Reps:</strong> {exercise.reps}</p>
                </li>
              ))}
            </ul>
            <Button onClick={handleCloseExercisesModal} className="mt-4">
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Modal to show the Edit Form */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="p-4 max-w-lg w-full">
            <ProgramEditForm />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramActions;
