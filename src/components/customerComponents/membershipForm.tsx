"use client";

import React, { useState } from "react";
import * as zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

// Define membership options and related values
const membershipOptions = [
  { value: "Standard", validity: "1 month", rate: "₱1500" },
  { value: "Premium", validity: "3 months", rate: "₱3000" },
  { value: "Elite", validity: "6 months", rate: "₱5500" },
];

// Zod schema for form validation
const membershipSchema = zod.object({
  membership_type: zod.enum(["Standard", "Premium", "Elite"], {
    required_error: "Please select a membership type.",
  }),
  validity_period: zod.string().optional(),
  rate: zod.string().optional(),
});

// MembershipForm Component
export default function MembershipForm({
  onSubmit,
}: {
  onSubmit: (data: any) => void;
}) {
  const [selectedMembership, setSelectedMembership] = useState({
    validity: "",
    rate: "",
  });
  const [isMembershipApplied, setIsMembershipApplied] = useState(false); // Track if membership is already applied
  const { toast } = useToast(); // ShadCN toast hook

  const form = useForm({
    resolver: zodResolver(membershipSchema),
    defaultValues: {
      membership_type: "",
      validity_period: "",
      rate: "",
    },
  });

  const handleMembershipChange = (type: string) => {
    const selected = membershipOptions.find((option) => option.value === type);
    if (selected) {
      setSelectedMembership({ validity: selected.validity, rate: selected.rate });
      form.setValue("validity_period", selected.validity);
      form.setValue("rate", selected.rate);
    }
  };

  const handleFormSubmit = (data: any) => {
    if (isMembershipApplied) {
      // Show error message if user tries to apply for multiple memberships
      toast({
        variant: "destructive",
        title: "Membership Already Applied",
        description: "You cannot apply for more than one membership.",
      });
      return;
    }

    // Show success message
    toast({
      title: "Membership Registered",
      description: `You have successfully registered for the ${data.membership_type} membership!`,
    });

    setIsMembershipApplied(true); // Mark the membership as applied
    onSubmit(data); // Trigger onSubmit callback
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Membership Type */}
          <FormField
            control={form.control}
            name="membership_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Membership Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleMembershipChange(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Membership Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Membership Types</SelectLabel>
                        {membershipOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.value}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Validity Period */}
          <FormField
            control={form.control}
            name="validity_period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Validity Period</FormLabel>
                <FormControl>
                  <Input {...field} value={selectedMembership.validity} disabled />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Rate */}
          <FormField
            control={form.control}
            name="rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rate</FormLabel>
                <FormControl>
                  <Input {...field} value={selectedMembership.rate} disabled />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            <CheckCircleIcon className="h-6 w-6 pr-2" />
            Register Membership
          </Button>
        </form>
      </Form>
    </>
  );
}
