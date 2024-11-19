"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


export default function Resetpassword() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [userType, setUserType] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Extract query parameters directly from the URL
      const urlParams = new URLSearchParams(window.location.search);
      setUserId(urlParams.get("userId") || "");
      setUserType(urlParams.get("userType") || "");
    }
  }, []);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");

    const data = {
      userId,
      userType,
      password,
    };
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reset-password/changePassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage("Password has been reset successfully. You can now log in.");
        setTimeout(() => {
          router.push("/"); // Redirect to login page after successful reset
        }, 3000);
      } else {
        setError(result.message || "Failed to reset password. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-background p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-foreground mb-4">Reset Password</h1>
        {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-foreground mb-2">
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter new password"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-foreground mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="Confirm new password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
