"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Ensure this is correctly imported

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EquipEditForm from "@/components/mngComponents/equipEditForm"; // Ensure you have an Equipment edit form
import EquipmentActions from "./actions";

// Define the shape of your Equipment and Maintenance data
export type Equipment = {
  equipment_id: number;
  name: string;
  quantity: number;
  purchase_date: Date;
};

export type Maintenance = {
  maint_id: number;
  equipment_id: number;
  maintenance_date: Date;
};

const maintenanceData: Maintenance[] = [
  {
    maint_id: 1,
    equipment_id: 1, // Treadmill
    maintenance_date: new Date("2024-09-05"), // Newly maintained (less than 30 days ago)
  },
  {
    maint_id: 2,
    equipment_id: 2, // Dumbbells
    maintenance_date: new Date("2024-07-10"), // Maintenance due soon (between 30 and 90 days ago)
  },
  {
    maint_id: 3,
    equipment_id: 3, // Dumbbells
    maintenance_date: new Date("2024-03-10"), // Maintenance due soon (between 30 and 90 days ago)
  },
];

// Helper function to calculate the number of days between two dates
const daysBetweenDates = (date1: Date, date2: Date) => {
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
  return Math.round(Math.abs((date2.getTime() - date1.getTime()) / oneDay));
};

// Define the columns for your Equipment table
export const columns: ColumnDef<Equipment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghostTable"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-2 p-0 justify-start"
      >
        Equipment
        <ArrowsUpDownIcon className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span>{row.original.name}</span>,
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => <span>{row.original.quantity}</span>,
  },
  {
    accessorKey: "purchase_date",
    header: "Purchase Date",
    cell: ({ row }) => (
      <span>{new Date(row.original.purchase_date).toLocaleDateString()}</span>
    ),
  },
  {
    id: "maintenance_date",
    header: "Maintenance Date",
    cell: ({ row }) => {
      const equipment = row.original;

      // Find the latest maintenance date for the current equipment
      const latestMaintenance = maintenanceData
        .filter((maintenance) => maintenance.equipment_id === equipment.equipment_id)
        .sort((a, b) => new Date(b.maintenance_date).getTime() - new Date(a.maintenance_date).getTime())[0];

      return latestMaintenance ? (
        <span>{new Date(latestMaintenance.maintenance_date).toLocaleDateString()}</span>
      ) : (
        <span>No Maintenance</span>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const equipment = row.original;

      // Find the latest maintenance date for the current equipment
      const latestMaintenance = maintenanceData
        .filter((maintenance) => maintenance.equipment_id === equipment.equipment_id)
        .sort((a, b) => new Date(b.maintenance_date).getTime() - new Date(a.maintenance_date).getTime())[0];

      if (!latestMaintenance) return <Badge className="rounded-full" variant="outline">No Maintenance</Badge>;

      const daysSinceMaintenance = daysBetweenDates(new Date(), new Date(latestMaintenance.maintenance_date));

      if (daysSinceMaintenance <= 30) {
        return <Badge className="rounded-full" variant="success">Newly Maintained</Badge>;
      } else if (daysSinceMaintenance > 90) {
        return <Badge className="rounded-full" variant="destructive">Needs Maintenance</Badge>;
      } else {
        return <Badge className="rounded-full" variant="pending">Maintenance Due Soon</Badge>;
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <EquipmentActions equipment={row.original} maintenanceData={maintenanceData} />
    ),
  },
];
