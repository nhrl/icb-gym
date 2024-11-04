import nodemailer from "nodemailer";
import supabase from "../../../database/db";

export async function sendEmail(data: any) {
    try {
        const {email} = data;
        const otp = generateOTP();
        console.log("Sending OTP to:", email); // Debug log
        const valid = await checkEmail(email);
    
        if (!valid) {
            return {
                success: false,
                message: "This email address is already in use. Please use a different email.",
            };
        }

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

          // Define the email options
          const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP code is: ${otp}`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        return {
            success: true,
            otp: otp
        }
    } catch (error: any) {
        return { success: false, message: "An error occurred during login", error: error.message };
    }
}

function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function checkEmail  (email: string) {
    const { data: existingManager } = await supabase
    .from('manager')
    .select('email')
    .eq('email', email)
    .single();

    const { data: existingCustomer } = await supabase
    .from('customer')
    .select('email')
    .eq('email', email)
    .single();

    if(existingCustomer || existingManager) {
        return false;
    } else {
        return true;
    }
}