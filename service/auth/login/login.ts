import supabase from "../../../database/db";

export async function verifyUser(info:any) {
    try {
        const {email, password} = info;
        // Sign in the user with their email and password
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });
    
        const { user, session } = data;
        // Handle errors in case login fails
        if (error) {
          return { success: false, message: error.message };
        }
    
        // Check if the user's email has been confirmed
        if (user && !user.email_confirmed_at) {
          return { success: false, message: "Please verify your email before logging in." };
        }
    
        // Successful login
        return { success: true, message: "Login successful", user, session };
      } catch (error: any) {
        return { success: false, message: "An error occurred during login", error: error.message };
      }
}