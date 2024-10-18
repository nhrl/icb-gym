"use client"
import * as React from "react"
import { useState, useEffect } from "react"
import {
  ColumnDef,
  flexRender,
  SortingState,
  getSortedRowModel,
  getCoreRowModel,
  VisibilityState,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ViewColumnsIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import TrainerForm from "@/components/mngComponents/trainerForm" 
import { Trainers } from "./columns"
import { useToast } from "@/hooks/use-toast"; // Import useToast
import { Toaster } from "@/components/ui/toaster";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  mutate: () => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  mutate,
}: DataTableProps<TData, TValue>) {

  const [sorting, setSorting] = React.useState<SortingState>([])

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const [rowSelection, setRowSelection] = React.useState({})

  const [isMounted, setIsMounted] = useState(false); // New state to track mounting
  const { toast } = useToast(); // Use the toast hook from Shadcn

  useEffect(() => {
    setIsMounted(true); // Set mounted to true after client-side rendering
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const metadata = {
    title: "Trainers",
    description: "manage your trainers",
  };

  const [isOpen, setIsOpen] = useState(false); // State to control modal visibility

  const handleOpenForm = () => {
    setIsOpen(true); // Open the form modal
  };

  const handleCloseForm = () => {
    setIsOpen(false); // Close the form modal
  };

  const handleDelete = async () => {
    const api = process.env.NEXT_PUBLIC_API_URL;
    const ids = table
      .getSelectedRowModel()
      .rows.map((row) => (row.original as Trainers).trainer_id); // Cast to Service
      try {
        const response = await fetch(`${api}/api/manager/trainer`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids }),  // Send the IDs to the server as JSON
        });
    
        const result = await response.json();
        if (result.success) {
          toast({
            title: "Trainer Deleted",
            description: "Trainer successfully deleted.",
            duration: 3000,
          });
          mutate();
        } else {
          // Handle the error, possibly display it to the user
          toast({
            title: "Trainer Delete Error",
            description: "Failed to delete trainer.",
            duration: 3000,
          });
        }
      } catch (error) {
        // Handle the error, possibly display it to the user
        toast({
          title: "Trainer Delete Error",
          description: "An error occurred during deletion.",
          duration: 3000,
        });
      }
  }
  // Don't render the table until after hydration (when the component has mounted)
  if (!isMounted) {
    return null; // Prevent rendering on the server to avoid mismatch
  }

  return (
    <div className="flex flex-col gap-4">

      <div>
        <h1 className="font-black text-2xl">{metadata.title}</h1>
        <p className="font-normal text-sm text-muted-foreground">{metadata.description}</p>
      </div>

      <div className="flex sm:flex-row flex-col items-center gap-2">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex flex-wrap sm:flex-row ml-auto gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex ml-auto flex-row gap-2">
                <ViewColumnsIcon className="h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter(
                  (column) => column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Add New Button */}
          <div className="flex flex-col gap-4">
            <Button
              variant="secondary"
              className="flex ml-auto flex-row gap-2"
              onClick={handleOpenForm} // Open form on button click
            >
              <PlusCircleIcon className="h-4 w-4" />
              Add New
            </Button>

            {isOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className=" rounded-md  w-full max-w-lg">
                  <TrainerForm onClose={handleCloseForm} mutate={mutate}/> 
                </div>
              </div>
            )}
          </div>

          {/* Delete Button */}
          <AlertDialog>
            <AlertDialogTrigger className="border border-border p-2 rounded-sm hover:bg-muted">
              <TrashIcon className="h-4 w-4" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete this?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently remove your data from the database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
      <Toaster />
    </div>
  )
}
