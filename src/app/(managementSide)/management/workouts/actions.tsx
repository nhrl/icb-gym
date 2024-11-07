import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import useSWR from "swr";
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
import { ArrowLeftIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import ExerciseForm from "@/components/mngComponents/exerciseForm";

type ProgramActionsProps = {
  program: Program;
  mutate: () => void;
};

const ProgramActions: React.FC<ProgramActionsProps> = ({ program, mutate }) => {
  const [isExercisesPopupOpen, setIsExercisesPopupOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPhotoPopupOpen, setIsPhotoPopupOpen] = useState(false);
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false); // Control visibility of Add Exercise form
  const defaultImage = "https://mplhgifjydkvnfsofsoc.supabase.co/storage/v1/object/public/images/error/no%20image.jpg?t=2024-10-19T02%3A30%3A35.308Z";
  const popupRef = useRef<HTMLDivElement>(null);

  const api = process.env.NEXT_PUBLIC_API_URL;
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data, error, isLoading } = useSWR(
    isExercisesPopupOpen ? `${api}/api/manager/plans/workout/exercise?id=${program.program_id}` : null,
    fetcher,
    { revalidateOnFocus: true }
  );

  const selectedExercises = data?.exercise || [];

  const handleOpenExercisesPopup = () => setIsExercisesPopupOpen(true);
  const handleOpenEditForm = () => setIsEditOpen(true);
  const handleCloseEditModal = () => setIsEditOpen(false);
  const handleOpenPhotoPopup = () => setIsPhotoPopupOpen(true);
  const handleClosePhotoPopup = () => setIsPhotoPopupOpen(false);
  const handleOpenAddExerciseForm = () => setIsAddExerciseOpen(true); // Open Add Exercise Form
  const handleCloseAddExerciseForm = () => setIsAddExerciseOpen(false); // Close Add Exercise Form

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
      {/* Dropdown Menu */}
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
          <DropdownMenuItem onClick={handleOpenAddExerciseForm}>
            <PlusCircleIcon className="h-4 w-4 mr-2" /> Add Exercise
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenExercisesPopup}>View Exercises</DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenPhotoPopup}>View Photo</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Exercises Popup */}
      {isExercisesPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div ref={popupRef} className="bg-background border border-border rounded-lg shadow-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Exercises for {program.title}</h2>
            {selectedExercises.length > 0 ? (
              <div className="flex flex-col gap-4">
                {selectedExercises.map((exercise: Exercise) => (
                  <Card key={exercise.exercise_id} className="bg-background border border-border rounded-md w-full sm:w-auto flex-1 mb-4">
                    <CardHeader>
                      <CardTitle>{exercise.exercise_name}</CardTitle>
                      <CardDescription>{exercise.exercise_description}</CardDescription>
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

      {/* Edit Form Modal */}
      {isEditOpen && program && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="p-4 max-w-lg w-full rounded-lg">
            <ProgramEditForm programData={program} onClose={handleCloseEditModal} mutate={mutate} />
          </div>
        </div>
      )}

      {/* Photo Popup */}
      {isPhotoPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-background border border-border rounded-lg shadow-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center mb-4">
              <ArrowLeftIcon
                className="h-6 w-6 cursor-pointer"
                onClick={handleClosePhotoPopup} // Close the photo popup on back button click
              />
              <h2 className="text-xl font-semibold ml-2">Photo for {program.title}</h2>
            </div>
            <Card className="bg-background border border-border rounded-md w-full sm:w-auto flex items-center justify-center p-6">
              <CardContent>
                <Image 
                  src={program.program_img || defaultImage} 
                  alt="Program Photo" 
                  width={600}
                  height={400}
                  className="w-full h-auto rounded-md" />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Add Exercise Form Modal */}
      {isAddExerciseOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-background border border-border rounded-lg shadow-lg p-12 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <ExerciseForm programId={program.program_id} onClose={handleCloseAddExerciseForm} /> {/* Insert Mutate */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramActions;
