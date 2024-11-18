import crypto from "crypto";
import nodemailer from "nodemailer";
import supabase from "../../database/db";
import supabaseAdmin from "../../database/dbAdmin";
import { encryptPassword } from "@service/encryption/hash";

export async function confirmEmail(data: any) {
  try {
    const { confirmEmail } = data;

    // Step 1: Fetch user information
    const { data: userManager, error: managerError } = await supabase
      .from("manager")
      .select("manager_id")
      .eq("email", confirmEmail)
      .single();

    const { data: userCustomer, error: customerError } = await supabase
      .from("customer")
      .select("customer_id")
      .eq("email", confirmEmail)
      .single();

    const user = userManager || userCustomer;

    // Type guard to determine user type
    const isManager = (user: any): user is { manager_id: any } => !!user?.manager_id;
    const isCustomer = (user: any): user is { customer_id: any } => !!user?.customer_id;

    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Extract user ID and type
    const userId = isManager(user) ? user.manager_id : isCustomer(user) ? user.customer_id : null;
    const userType = isManager(user) ? "manager" : "customer";

    if (!userId) {
      return { success: false, message: "Unable to determine user type" };
    }

    // Step 2: Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Step 3: Save token and expiration to the database
    const tokenExpiry = new Date();
    tokenExpiry.setMinutes(tokenExpiry.getMinutes() + 5); // Token valid for 5 minutes

    await supabase
      .from(userType) // Dynamically target "manager" or "customer" table
      .update({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: tokenExpiry.toISOString(),
      })
      .eq(userType === "manager" ? "manager_id" : "customer_id", userId);

    console.log("Reset Token:", resetToken);

    // Step 4: Set up email transport
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates
      },
    });

    // Step 5: Define reset link
    const resetLink = `${process.env.NEXT_PUBLIC_API_URL}/reset-password?userId=${userId}&userType=${userType}&token=${resetToken}`;
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: confirmEmail,
      subject: "Password Reset Link",
      text: `Hello,\n\nYou requested a password reset. Click the link below to reset your password:\n\n${resetLink}\n\nThis link is valid for 5 minutes.\n\nIf you didn't request this, please ignore this email.`,
    };

    // Step 6: Send the email
    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: "Reset link sent successfully",
    };
  } catch (error: any) {
    console.error("Error in confirmEmail:", error);
    return { success: false, message: "An error occurred", error: error.message };
  }
}


export async function changePassword(data: any) {
  try {
    const { userId, userType, password } = data;

    // Validate `userType` to ensure it's either "manager" or "customer"
    if (!['manager', 'customer'].includes(userType)) {
      return { success: false, message: "Invalid user type" };
    }

    // Dynamically fetch user from the appropriate table
    const { data: userData, error: fetchError } = await supabase
      .from(userType) // Dynamically select the table
      .select("*")
      .eq(userType === 'manager' ? 'manager_id' : 'customer_id', userId) // Dynamically set the condition
      .single();

    if (fetchError || !userData) {
      return { success: false, message: "User not found" };
    }

    const uuid = userData.uuid;

    if (password?.trim()) {
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(uuid, { password });
      if (authError) {
      return { 
          success: false, 
          message: 'Failed to update user password in Supabase Auth.', 
          error: authError.message 
      };
      }
    }

    const newPass = password ? await encryptPassword(password) : userData.password;
    
    const userUpdateInfo = {
      password: newPass
    }

    const { error: updateError } = await supabase
    .from(userType) // Dynamically select the table ('manager' or 'customer')
    .update(userUpdateInfo) // Update the provided information
    .eq(userType === 'manager' ? 'manager_id' : 'customer_id', userId); // Dynamically set the condition

    if(updateError) {
      return {
        success: false
      }
    }

    return {
      success: true,
      message: "Password updated successfully",
    };
  } catch (error: any) {
    console.error("Error in changePassword:", error);
    return { success: false, message: "An error occurred", error: error.message };
  }
}
