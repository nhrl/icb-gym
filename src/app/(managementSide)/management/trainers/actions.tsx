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
import TrainerEditForm from "@/components/mngComponents/trainerEditForm";
import TrainerAssignForm from "@/components/mngComponents/trainerAssignForm";
import { AssignmentTable } from "./columns"; // Adjust the import path
import { Trainers } from "./columns"; // Adjust the import path
import { ArrowLeftIcon } from "@heroicons/react/24/outline"; // Import ArrowLeftIcon for the back button

type TrainerActionsProps = {
  trainer: Trainers;
  mutate: () => void;
};

const TrainerActions: React.FC<TrainerActionsProps> = ({ trainer, mutate }) => {
  const [isOpen, setIsOpen] = useState(false); // State to control edit form visibility
  const [isAssignOpen, setIsAssignOpen] = useState(false); // State to control assignment form visibility
  const [isAssignmentsPopupOpen, setIsAssignmentsPopupOpen] = useState(false); // State to control assignments popup

  const handleOpenEditForm = () => {
    setIsOpen(true); // Open the edit form modal
  };

  const handleOpenAssignForm = () => {
    setIsAssignOpen(true); // Open the assignment form modal
  };

  const handleToggleAssignmentsPopup = () => {
    setIsAssignmentsPopupOpen((prev) => !prev); // Toggle assignments popup
  };

  const handleCloseModal = () => {
    setIsOpen(false); // Close edit form modal
    setIsAssignOpen(false); // Close assignment form modal
    setIsAssignmentsPopupOpen(false); // Close assignments popup
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
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(trainer.trainer_id.toString())}>
            Copy Trainer ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleOpenEditForm}>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenAssignForm}>Assign to Service</DropdownMenuItem>
          <DropdownMenuItem onClick={handleToggleAssignmentsPopup}>
            {isAssignmentsPopupOpen ? "Hide Assignments" : "View Assignments"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Popup for Viewing Assignments */}
      {isAssignmentsPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background border border-border rounded-lg shadow-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            {/* Back Button */}
            <div className="flex items-center mb-4">
              <ArrowLeftIcon
                className="h-6 w-6 cursor-pointer"
                onClick={handleCloseModal} // Close the assignments popup on back button click
              />
              <h2 className="text-xl font-semibold ml-2">
                Assignments for {trainer.firstname} {trainer.lastname}
              </h2>
            </div>
            <AssignmentTable trainerId={trainer.trainer_id} />
          </div>
        </div>
      )}

      {/* Modal for Editing Trainer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="p-4 max-w-lg w-full rounded-lg">
            <TrainerEditForm trainerData={trainer} onClose={handleCloseModal} mutate={mutate} />
          </div>
        </div>
      )}

      {/* Modal for Assigning Trainer to a Service */}
      {isAssignOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="p-4 max-w-lg w-full">
            <TrainerAssignForm trainerId={trainer.trainer_id} onClose={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerActions;
