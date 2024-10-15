"use client";
import * as React from "react";
import { useState } from "react";
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
} from "@tanstack/react-table";

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
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ViewColumnsIcon, PlusCircleIcon, TrashIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


import { MembershipRegistration } from "./columns";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  mutate: () => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  mutate,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isModalOpen, setIsModalOpen] = useState(false); // Single state to control modal visibility

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
  });

  const metadata = {
    title: "Memberships",
    description: "Manage your memberships",
  };

  const api = process.env.NEXT_PUBLIC_API_URL;
  const handleConfirm = async() => {
    const ids = table
    .getSelectedRowModel()
    .rows.map((row) => (row.original as MembershipRegistration).membership_rid); 
    try {
      const response = await fetch(`${api}/api/manager/transaction/membership`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }), // Send the IDs to the server as JSON
      })

      const result = await response.json();
      if(result.success) {
        mutate(); // Assuming mutate refreshes the data or triggers necessary action
      } else {
        //error message here
      }
    } catch (error) {
      console.error("An error occurred during confirmation: ", error);
      // Handle the error, possibly display it to the user
    }
  };

  const handleDelete = async () => {
    const ids = table
      .getSelectedRowModel()
      .rows.map((row) => (row.original as MembershipRegistration).membership_rid); // Cast to MembershipRegistration
    try {
      const response = await fetch(`${api}/api/manager/transaction/cancelMembership`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }), // Send the IDs to the server as JSON
      });

      const result = await response.json();
      if (result.success) {
        console.log("Successfully deleted membership: ", result);
        mutate();
      } else {
        console.error("Failed to delete membership: ", result.message);
        // Handle the error, possibly display it to the user
      }
    } catch (error) {
      console.error("An error occurred during deletion: ", error);
      // Handle the error, possibly display it to the user
    }
  };
  

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-black text-2xl">{metadata.title}</h1>
        <p className="font-normal text-sm text-muted-foreground">{metadata.description}</p>
      </div>

      <div className="flex sm:flex-row flex-col items-center gap-2">
        <Input
          placeholder="Filter memberships..."
          value={(table.getColumn("membership_rID")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("membership_rID")?.setFilterValue(event.target.value)
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
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Confirm Membership Button */}
          <div className="flex flex-col gap-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="secondary"
                  className="flex ml-auto flex-row gap-2"
                >
                  <CheckCircleIcon className="h-4 w-4" />
                  Confirm Membership
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Membership?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to confirm this membership? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirm}>Confirm</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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
    </div>
  );
}
