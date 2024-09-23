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
import {Modal} from "./columns"; // Make sure you have a modal component
import TrainerEditForm from "@/components/mngComponents/trainerEditForm";
import TrainerAssignForm from "@/components/mngComponents/trainerAssignForm";
import {AssignmentTable} from "./columns"; // Adjust import path
import { Trainers } from "./columns";

type TrainerActionsProps = {
  trainer: Trainers;
};

const TrainerActions: React.FC<TrainerActionsProps> = ({ trainer }) => {
  const [isOpen, setIsOpen] = useState(false); // State to control edit form visibility
  const [isAssignOpen, setIsAssignOpen] = useState(false); // State to control assignment form visibility
  const [isAssignmentsViewOpen, setIsAssignmentsViewOpen] = useState(false); // State to control assignments view visibility

  const handleOpenEditForm = () => {
    setIsOpen(true); // Open the edit form modal
  };

  const handleOpenAssignForm = () => {
    setIsAssignOpen(true); // Open the assignment form modal
  };

  const handleOpenAssignmentsView = () => {
    setIsAssignmentsViewOpen(true); // Open the assignments view modal
  };

  const handleCloseModals = () => {
    setIsOpen(false); // Close all modals when necessary
    setIsAssignOpen(false);
    setIsAssignmentsViewOpen(false);
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
          <DropdownMenuItem onClick={handleOpenAssignmentsView}>View Assignments</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal for Editing Trainer */}
      {isOpen && (
        <Modal onClose={handleCloseModals}>
          <TrainerEditForm trainerId={trainer.trainer_id} onClose={handleCloseModals} />
        </Modal>
      )}

      {/* Modal for Assigning Trainer to a Service */}
      {isAssignOpen && (
        <Modal onClose={handleCloseModals}>
          <TrainerAssignForm trainerId={trainer.trainer_id} onClose={handleCloseModals} />
        </Modal>
      )}

      {/* Modal for Viewing Trainer Assignments */}
      {isAssignmentsViewOpen && (
        <Modal onClose={handleCloseModals}>
          <AssignmentTable trainerId={trainer.trainer_id} />
        </Modal>
      )}
    </div>
  );
};

export default TrainerActions;
