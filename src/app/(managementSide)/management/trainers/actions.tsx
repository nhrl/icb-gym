import { useState, useEffect, useRef } from "react";
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

type TrainerActionsProps = {
  trainer: Trainers;
  mutate:() => void;
};

const TrainerActions: React.FC<TrainerActionsProps> = ({ trainer, mutate}) => {
  const [isOpen, setIsOpen] = useState(false); // State to control edit form visibility
  const [isAssignOpen, setIsAssignOpen] = useState(false); // State to control assignment form visibility
  const [isAssignmentsPopupOpen, setIsAssignmentsPopupOpen] = useState(false); // State to control assignments popup
  const popupRef = useRef<HTMLDivElement>(null);

  const handleOpenEditForm = () => {
    setIsOpen(true); // Open the edit form modal
  };

  const handleOpenAssignForm = () => {
    setIsAssignOpen(true); // Open the assignment form modal
  };

  const handleToggleAssignmentsPopup = () => {
    setIsAssignmentsPopupOpen((prev) => !prev); // Toggle assignments popup
  };

  const handleCloseEditModal = () => {
    setIsOpen(false); // Close edit form modal
    setIsAssignOpen(false); // Close assignment form modal
  };

  // Close popup if the user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsAssignmentsPopupOpen(false); // Close the assignments popup
      }
    };

    if (isAssignmentsPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAssignmentsPopupOpen]);

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
          <div
            ref={popupRef}
            className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
          >
            <h2 className="text-xl font-semibold mb-4">
              Assignments for {trainer.firstname} {trainer.lastname}
            </h2>
            <AssignmentTable trainerId={trainer.trainer_id} />
          </div>
        </div>
      )}

      {/* Modal for Editing Trainer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="p-4 max-w-lg w-full rounded-lg">
            <TrainerEditForm trainerData={trainer} onClose={handleCloseEditModal} mutate={mutate}/>
          </div>
        </div>
      )}

      {/* Modal for Assigning Trainer to a Service */}
      {isAssignOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="p-4 max-w-lg w-full rounded-lg">
            <TrainerAssignForm trainerId={trainer.trainer_id} onClose={handleCloseEditModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerActions;
