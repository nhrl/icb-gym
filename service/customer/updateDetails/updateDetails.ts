import { encryptPassword } from "@service/encryption/hash";
import supabase from "../../../database/db";
import supabaseAdmin from "../../../database/dbAdmin";
import { getFilePathFromUrl, uploadImage, removeImage } from "@service/imageUpload/imageUploader";

const FEMALE_IMG_URL = "https://mplhgifjydkvnfsofsoc.supabase.co/storage/v1/object/public/images/profile/female.jpg";
const MALE_IMG_URL = "https://mplhgifjydkvnfsofsoc.supabase.co/storage/v1/object/public/images/profile/male.jpg";
const folder = 'profile';

export async function changeProfilePicture(data:any) {
    try {
        const image = data.get('photo') as File;
        const id = Number(data.get('id'));

        const {data: userData, error} = await supabase
        .from('customer')
        .select()
        .eq('customer_id',id)
        .single()

        if(error) {
            return { success: false, message: 'Error fetching customer data.' };
        }

        const currentImage = userData.profile_img;
        let imageUrl = currentImage;

        if (image && image.size > 0) {
            const filePath = `${folder}/${image.name}`;
            const currentImageFilePath = getFilePathFromUrl(currentImage);

            // Upload new image if the file path is different from the current one
            if (filePath !== currentImageFilePath) {
                imageUrl = await uploadImage(image, folder);

                if (!imageUrl) {
                    return { success: false, message: 'Failed to upload new image.' };
                }

                // Delete the current image if it's not a default image
                if (currentImage !== FEMALE_IMG_URL && currentImage !== MALE_IMG_URL) {
                    const oldImageFilePath = currentImageFilePath;
                    const { success, error: removalError } = await removeImage(oldImageFilePath);

                    if (!success) {
                        return { success: false, message: 'Failed to remove old image.', error: removalError };
                    }
                }
            }
        }

        const {error: updateError} = await supabase
        .from('customer')
        .update({'profile_img': imageUrl})
        .eq('customer_id',id)

        if(updateError) {
            return { success: false, message: 'Failed to update customer info.', error: updateError.message };
        }
        return { success: true, message: 'Customer profile updated successfully.' };
    } catch (error : any) {
        return { success: false, message: 'An unexpected error occurred.', error: error.message };
    }
}

export async function updateUserDetails(data: any) {
    try {
        // Extract and parse FormData values
        const id = Number(data.get('customer_id'));
        const fitness_goals = data.get('selectedGoals') as string;
        const time_preference = data.get('timePreference') as string;
        const fitness_level = data.get('fitnessLevel') as string;
        const email = data.get('email') as string;
        const username = data.get('username') as string;
        const password = data.get('newPassword') as string;
  
        // Fetch current user details from Supabase
        const { data: userData, error: fetchError } = await supabase
            .from('customer')
            .select()
            .eq('customer_id', id)
            .single();
    
        if (fetchError) {
            return { success: false, message: 'Error fetching customer data.', error: fetchError.message };
        }
  
        const uuid = userData.uuid;
  
        // Check if email needs updating
        if (email !== userData.email) {
            const valid = await checkEmail(email);
            if (!valid) {
            return { 
                success: false, 
                message: 'This email address is already in use by another manager. Please use a different email.' 
            };
            }
    
            const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(uuid, { email });
            if (authError) {
            console.error('Error updating user in Supabase Auth:', authError);
            return { 
                success: false, 
                message: 'Failed to update user email in Supabase Auth.', 
                error: authError.message 
            };
            }
        }
  
        // Update password if provided
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
    
        // Prepare updated user information
        const userUpdatedInfo = {
            email,
            password: newPass,
            fitness_goals,
            fitness_level,
            time_preference,
            username,
        };
    
        // Update the customer details in Supabase
        const { error: updateError } = await supabase
            .from('customer')
            .update(userUpdatedInfo)
            .eq('customer_id', id);
    
        if (updateError) {
            return { 
            success: false, 
            message: 'Failed to update customer info.', 
            error: updateError.message 
            };
        }
  
        return { success: true, message: 'Customer info updated successfully.' };
    } catch (error: any) {
      console.error('Unexpected error:', error);
      return { 
        success: false, 
        message: 'An unexpected error occurred.', 
        error: error.message 
      };
    }
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