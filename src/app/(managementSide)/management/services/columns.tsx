"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import ServiceEditForm from "@/components/mngComponents/serviceEditForm"; // Ensure you have a Service edit form

// Define the shape of your data based on the Service type
export type Service = {
  id: string;
  name: string;
  desc: string;
};

// Define the columns for your Service table
export const columns: ColumnDef<Service>[] = [
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
        Service Name
        <ArrowsUpDownIcon className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span>{row.original.name}</span>,
  },
  {
    accessorKey: "desc",
    header: "Description",
    cell: ({ row }) => <span>{row.original.desc}</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const service = row.original;

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
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(service.id)}
              >
                Copy Service ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleOpenForm}>Edit</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div>
          {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
              <div className="rounded-md w-full max-w-lg">
                <ServiceEditForm serviceId={service.id} />
              </div>
            </div>
          )}
          </div>
        </div>
      );
    },
  },
];
