import supabase from "../../../database/db";
import supabaseAdmin from "../../../database/dbAdmin";
import { verifyPassword, encryptPassword } from '@service/encryption/hash'; // Assuming you have these functions

export async function resetPassword(data: any) {
  const { newPassword, currentPassword, hashPassword, id} = data;
  const match = await verifyPassword(currentPassword, hashPassword);

  if (match) {
    const {data, error} = await supabase
    .from('manager')
    .select('uuid')
    .eq('manager_id', id)
    .single()

    if(error) {
      return {success: false, message:'Error fetching the manager data'}
    }

    const uuid = data?.uuid;
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(uuid, {
      password: newPassword
    });

    if (authError) {
      return { success: false, message: 'Failed to update user in Supabase Auth', error: authError };
    }

    const newPass = await encryptPassword(newPassword);
  
    const{error: updateError} = await supabase
    .from('manager')
    .update({password: newPass})
    .eq('manager_id', id)

    if(updateError) {
      return {success: false, message: 'Error encounter while updating your password', error: updateError}
    }
    return {success: true, message: 'Password updates successfully'}
  } else {
    console.log('Current password is incorrect');
    return { success: false, message: 'Current password is incorrect' };
  }
}
