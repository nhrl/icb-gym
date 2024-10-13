"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

export type Booking = {
  booking_id: number;
  customer_id: number; // foreign key
  trainer_id: number; // foreign key
  payment_status: string;
  confirmation_status: string;
  created_at: Date;
};

// Define the columns for your Booking table
export const columns: ColumnDef<Booking>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || 
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
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
    accessorKey: "booking_id",
    header: "Booking ID",
    cell: ({ row }) => (
      <span className="text-foreground">{row.original.booking_id}</span>
    ),
  },
  {
    accessorKey: "customer_id",
    header: "Customer ID",
    cell: ({ row }) => (
      <span className="text-foreground">{row.original.customer_id}</span>
    ),
  },
  {
    accessorKey: "trainer_id",
    header: "Trainer ID",
    cell: ({ row }) => (
      <span className="text-foreground">{row.original.trainer_id}</span>
    ),
  },
  {
    accessorKey: "payment_status",
    header: "Payment Status",
    cell: ({ row }) => {
      const paymentStatus = row.original.payment_status;
      const variant =
        paymentStatus === "Paid" ? "success" : "destructive";
      const dotColor = variant === "success" ? "bg-green-500" : "bg-red-500";

      return (
        <Badge
          className="rounded-full w-fit flex items-center gap-2 text-white bg-opacity-80"
          variant={variant}
        >
          <span className={`w-1 h-1 rounded-full ${dotColor}`}></span>
          {paymentStatus}
        </Badge>
      );
    },
  },
  {
    accessorKey: "confirmation_status",
    header: "Confirmation Status",
    cell: ({ row }) => {
      const confirmationStatus = row.original.confirmation_status;
      const variant =
        confirmationStatus === "Confirmed"
          ? "success"
          : confirmationStatus === "Pending"
          ? "pending"
          : "destructive";
      const dotColor =
        variant === "success"
          ? "bg-green-500"
          : variant === "pending"
          ? "bg-yellow-500"
          : "bg-red-500";

      return (
        <Badge
          className="rounded-full w-fit flex items-center gap-2 text-white bg-opacity-80"
          variant={variant}
        >
          <span className={`w-1 h-1 rounded-full ${dotColor}`}></span>
          {confirmationStatus}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Booked on",
    cell: ({ row }) => (
      <span className="text-foreground">
        {row.original.created_at
          ? new Date(row.original.created_at).toDateString()
          : "N/A"}
      </span>
    ),
  },
];
