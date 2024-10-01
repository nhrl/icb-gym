import React, { useState } from "react";
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
import EquipEditForm from "@/components/mngComponents/equipEditForm"; // Ensure this is correctly imported
import { Maintenance } from "./columns"; // Import your Maintenance type

// Props for the component
type EquipmentActionsProps = {
  equipment: any;
  maintenanceData: Maintenance[];
  mutate: () => void;
};

const EquipmentActions: React.FC<EquipmentActionsProps> = ({ equipment, maintenanceData, mutate }) => {
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false); // State to control maintenance modal visibility
  const [isEditOpen, setIsEditOpen] = useState(false); // State to control edit form modal visibility
  const [selectedMaintenance, setSelectedMaintenance] = useState<Maintenance[]>([]); // State for selected maintenance
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<number | null>(null); // Store selected equipment ID

  const handleOpenMaintenanceModal = () => {
    const maintenanceForEquipment = maintenanceData.filter(
      (maintenance) => maintenance.equipment_id === equipment.equipment_id
    );
    setSelectedMaintenance(maintenanceForEquipment);
    setIsMaintenanceOpen(true);
  };

  const handleOpenEditForm = (id: any) => {
    setSelectedEquipmentId(id); // Store the selected equipment ID
    setIsEditOpen(true); // Open the edit form modal

  };

  const handleCloseMaintenanceModal = () => {
    setIsMaintenanceOpen(false);
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
            onClick={() => navigator.clipboard.writeText(equipment.equipment_id.toString())}
          >
            Copy Equipment ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleOpenEditForm(equipment.equipment_id)}>
            Set Maintenance
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal to show the Maintenance */}
      {isMaintenanceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-4">Maintenance for {equipment.name}</h2>
            <ul className="space-y-2">
              {selectedMaintenance.map((maintenance) => (
                <li key={maintenance.maint_id} className="border-b pb-2 mb-2">
                  <p>
                    <strong>Maintenance Date:</strong>{" "}
                    {new Date(maintenance.maintenance_date).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
            <Button onClick={handleCloseMaintenanceModal} className="mt-4">
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Modal to show the Edit Form */}
      {isEditOpen && selectedEquipmentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="p-4 max-w-lg w-full">
            <EquipEditForm onClose={handleCloseEditModal} equipment_id={selectedEquipmentId.toString()} mutate={mutate}/>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentActions;
