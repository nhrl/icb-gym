"use client";

import React, { useState, useEffect } from "react";
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
import CryptoJS from 'crypto-js';

// Zod schema for form validation
const membershipSchema = zod.object({
  membership_type: zod.string().nonempty("Please select a membership type."),
  validity_period: zod.string().optional(),
  rate: zod.number().optional(),
  membership_id: zod.number().optional(), // Add membership_id to schema
});

interface MembershipFormProps {
  onSubmit: (data: any) => void;
  onClose: () => void; // Added onClose prop
}

export default function MembershipForm({
  onSubmit,
  onClose, // Added onClose prop to close the form
}: MembershipFormProps) {
  const [membershipOptions, setMembershipOptions] = useState<any[]>([]);
  const [selectedMembership, setSelectedMembership] = useState<any>(null);
  const [isMembershipApplied, setIsMembershipApplied] = useState(false); // Track if membership is already applied
  const [user_id, setUserID] = useState();
  const { toast } = useToast(); // ShadCN toast hook

  const form = useForm({
    resolver: zodResolver(membershipSchema),
    defaultValues: {
      membership_type: "",
      validity_period: "",
      rate: 0,
      membership_id: undefined, // Default value for membership_id
    },
  });

  const { reset } = form;

  const fetchUserFromCookie = () => {
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || 'lhS7aOXRUPGPDId6mmHJdA00p39HAfU4';
    const cookies = document.cookie.split("; ").reduce((acc: { [key: string]: string }, cookie) => {
      const [name, value] = cookie.split("=");
      acc[name] = value;
      return acc;
    }, {});

    const userCookie = cookies['user']; 

    if (!userCookie) {
      console.error("User cookie not found");
      return null;
    }

    try {
      const decryptedUserBytes = CryptoJS.AES.decrypt(userCookie, secretKey);
      const decryptedUser = JSON.parse(decryptedUserBytes.toString(CryptoJS.enc.Utf8));
      return decryptedUser.id; // Assuming user ID is part of the decrypted data
    } catch (error) {
      console.error("Error decrypting the user cookie", error);
      return null;
    }
  }

  const api = process.env.NEXT_PUBLIC_API_URL;

  // Fetch membership options from the API
  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const response = await fetch(`${api}/api/manager/plans/membership`);
        const data = await response.json();
        setMembershipOptions(data.data); // Use 'data' field from API response
        reset({
          membership_type: "",
          validity_period: "",
          rate: 0,
          membership_id: undefined,
        });
        const user_id = fetchUserFromCookie();
        setUserID(user_id);
      } catch (error) {
        console.error("Failed to fetch memberships", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load membership options.",
        });
      }
    };

    fetchMemberships();
  }, [reset, toast, api]);

  const handleMembershipChange = (type: string) => {
    const selected = membershipOptions.find(
      (option) => option.membership_type === type
    );
    if (selected) {
      setSelectedMembership(selected);
      form.setValue("validity_period", selected.validity_period);
      form.setValue("rate", selected.rate);
      form.setValue("membership_id", selected.membership_id); // Set membership_id
    }
  };

  const handleFormSubmit = async (data: any) => {
    if (isMembershipApplied) {
      toast({
        variant: "destructive",
        title: "Membership Already Applied",
        description: "You cannot apply for more than one membership.",
      });
      return;
    }

    const payload = {
      user_id: user_id, 
      membership_id: selectedMembership?.membership_id,
    };
    
    const response = await fetch(`${api}/api/customer/membership`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const message = await response.json();
    if(message.success) {
      toast({
        title: "Membership Registered",
        description: `You have successfully registered for the ${data.membership_type} membership!`,
      });
      onSubmit(data); // Trigger onSubmit callback with membership_id included
      onClose(); // Close the form after successful submission
    } else {
      console.log(message.error);
    }
    setIsMembershipApplied(true); // Mark the membership as applied
  };

  return (
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
                        <SelectItem
                          key={option.membership_id}
                          value={option.membership_type}
                        >
                          {option.membership_type}
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
                <Input {...field} value={selectedMembership?.validity_period || ""} disabled />
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
                <Input {...field} value={selectedMembership?.rate || 0} disabled />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full" variant="secondary">
          <CheckCircleIcon className="h-3 w-3" />
          Register Membership
        </Button>
      </form>
    </Form>
  );
}
