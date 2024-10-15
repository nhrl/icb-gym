"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

export type MembershipRegistration = {
  membership_rid: number;
  customer_id: number; // foreign key
  customer_name: string; // new field for displaying customer name
  membership_ID: number; // foreign key
  payment_status: string;
  status: string;
  date_start: Date;
  date_end: Date;
  created_at: Date;
};

// Define the columns for your MembershipRegistration table
export const columns: ColumnDef<MembershipRegistration>[] = [
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
    accessorKey: "membership_rID",
    header: "Membership ID",
    cell: ({ row }) => <span>{row.original.membership_rid}</span>,
  },
  {
    accessorKey: "customer_name", // Display customer name
    header: "Customer Name",
    cell: ({ row }) => <span>{row.original.customer_name}</span>,
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
      const dotColor = variant === "success" ? "bg-green-500" : "bg-background";

      return (
        <Badge className="rounded-full w-fit flex items-center gap-2" variant={variant}>
          <span className={`w-1 h-1 rounded-full ${dotColor}`}></span>
          {paymentStatus}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status as string;
  
      // Map statuses to valid badge variants
      const statusToVariantMap: { [key: string]: "success" | "destructive" | "pending" | "secondary" } = {
        Active: "success",      // Green
        Expired: "destructive", // Red
        Pending: "pending",     // Default pending color
        Canceled: "secondary",  // Gray
      };
  
      const variant = statusToVariantMap[status] || "secondary"; // Default to 'secondary'
  
      // Map statuses to specific dot colors
      const dotColorMap: { [key: string]: string } = {
        Active: "bg-green-500",
        Expired: "bg-red-500",
        Pending: "bg-yellow-500",
        Canceled: "bg-gray-500",
      };
  
      const dotColor = dotColorMap[status] || "bg-background"; // Default to background
  
      return (
        <Badge className="rounded-full w-fit flex items-center gap-2" variant={variant}>
          <span className={`w-1 h-1 rounded-full ${dotColor}`}></span>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "date_start",
    header: "Start Date",
    cell: ({ row }) => (
      <span>
        {row.original.date_start ? new Date(row.original.date_start).toDateString() : "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "date_end",
    header: "End Date",
    cell: ({ row }) => (
      <span>
        {row.original.date_end ? new Date(row.original.date_end).toDateString() : "N/A"}
      </span>
    ),
  },
];
