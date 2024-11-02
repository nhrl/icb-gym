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
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "../ui/toaster";

import CryptoJS from 'crypto-js';

const targetWeightSchema = zod.object({
  target_weight: zod
    .string()
    .min(1, "Target weight is required")
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val > 0, "Target weight must be a positive number"),
});

export default function TargetWeightForm({
  onSubmit,
}: {
  onSubmit: (data: any) => void;
}) {
  const [user_id, setUserID] = useState<number | undefined>();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(targetWeightSchema),
    defaultValues: {
      target_weight: "",
    },
  });

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
      return decryptedUser.id;
    } catch (error) {
      console.error("Error decrypting the user cookie", error);
      return null;
    }
  };

  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const user_id = fetchUserFromCookie();
    setUserID(user_id);
  }, []);

  const handleFormSubmit = async (data: any) => {
    const payload = {
      customer_id: user_id,
      target_weight: data.target_weight,
    };
    console.log(payload);
    const response = await fetch(`${api}/api/customer/progress/targetWeight`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const message = await response.json();
    if (message.success) {
      toast({
        title: "Target Weight Set",
        description: `Your target weight of ${data.target_weight} has been set successfully!`,
      });
      onSubmit(data);
    } else {
      console.error(message.error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to set target weight.",
      });
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Target Weight */}
          <FormField
            control={form.control}
            name="target_weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Weight</FormLabel>
                <FormControl>
                  <Input {...field} type="number" placeholder="Enter your target weight" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            <CheckCircleIcon className="h-3 w-3" />
            Set Target Weight
          </Button>
        </form>
      </Form>
      {/* Toaster for showing toast messages */}
      <Toaster />
    </>
  );
}
