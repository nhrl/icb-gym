import supabase from "../../../database/db";
import { verifyPassword, encryptPassword } from '@service/encryption/hash'; // Assuming you have these functions

export async function resetPassword(data: any) {
  const { newPassword, currentPassword, hashPassword, id, session } = data;
  const match = await verifyPassword(currentPassword, hashPassword);

  if (match) {
    const newHashedPassword = await encryptPassword(newPassword);
    const { error: dbError } = await supabase
      .from('manager') 
      .update({ password: newHashedPassword }) 
      .eq('manager_id', id); 

    if (dbError) {
      console.error('Error updating password in the database:', dbError);
      return { success: false, message: 'Failed to update password in the database' };
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData?.session) {
      console.error('Error retrieving session:', sessionError);
      return { success: false, message: 'Authentication session is missing or invalid' };
    }

    const { error: authError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (authError) {
      console.error('Error updating password in Supabase Authentication:', authError);
      return { success: false, message: 'Failed to update password in Supabase Authentication' };
    }
    return { success: true, message: 'Password successfully updated' };
  } else {
    console.log('Current password is incorrect');
    return { success: false, message: 'Current password is incorrect' };
  }
}
