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
    accessorKey: "booking_id",
    header: "Booking ID",
    cell: ({ row }) => <span>{row.original.booking_id}</span>,
  },
  {
    accessorKey: "customer_id",
    header: "Customer ID",
    cell: ({ row }) => <span>{row.original.customer_id}</span>,
  },
  {
    accessorKey: "trainer_id",
    header: "Trainer ID",
    cell: ({ row }) => <span>{row.original.trainer_id}</span>,
  },
  {
    accessorKey: "payment_status",
    header: "Payment Status",
    cell: ({ row }) => {
      const paymentStatus = row.original.payment_status as string;
      const paymentStatusToVariantMap: { [key: string]: "success" | "destructive" } = {
        Paid: "success",
        Unpaid: "destructive",
      };
      const variant = paymentStatusToVariantMap[paymentStatus] || "secondary";
      const dotColor = variant === "success" ? "bg-green-500" : "bg-red-500";
  
      return (
        <Badge className="rounded-full w-fit flex items-center gap-2" variant={variant}>
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
      const confirmationStatus = row.original.confirmation_status as string;
      const statusToVariantMap: { [key: string]: "success" | "destructive" | "secondary" } = {
        Confirmed: "success",
        Pending: "secondary",
        Canceled: "destructive",
      };
      const variant = statusToVariantMap[confirmationStatus] || "secondary";
      const dotColor = {
        success: "bg-green-500",
        destructive: "bg-red-500",
        secondary: "bg-gray-500",
      }[variant];
  
      return (
        <Badge className="rounded-full w-fit flex items-center gap-2" variant={variant}>
          <span className={`w-1 h-1 rounded-full ${dotColor}`}></span>
          {confirmationStatus}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => (
      <span>
        {row.original.created_at ? new Date(row.original.created_at).toDateString() : "N/A"}
      </span>
    ),
  },
];
