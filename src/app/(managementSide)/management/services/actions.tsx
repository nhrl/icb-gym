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
import ServiceEditForm from "@/components/mngComponents/serviceEditForm"; // Ensure you have a Service edit form
import { Service } from "./columns"; // Ensure you have a Service type

// Define props for the ServiceActions component
type ServiceActionsProps = {
  service: Service; // Expecting the full service object
};

const ServiceActions: React.FC<ServiceActionsProps> = ({ service }) => {
  const [isOpen, setIsOpen] = useState(false); // State to control modal visibility

  const handleOpenForm = () => {
    setIsOpen(true); // Open the form modal
  };

  const handleCloseForm = () => {
    setIsOpen(false); // Close the form modal
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
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(service.id)}>
            Copy Service ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleOpenForm}>Edit</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal to show the Edit Form */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="rounded-md w-full max-w-lg">
            <ServiceEditForm onClose={handleCloseForm} serviceData={service} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceActions;
