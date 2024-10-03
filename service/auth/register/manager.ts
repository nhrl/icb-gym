import supabase from "../../../database/db";
import { encryptPassword } from "../../encryption/hash";
import { uploadImage,getFilePathFromUrl,removeImage} from "@service/imageUpload/imageUploader";

const FEMALE_IMG_URL = "https://mplhgifjydkvnfsofsoc.supabase.co/storage/v1/object/public/images/profile/female.jpg";
const MALE_IMG_URL = "https://mplhgifjydkvnfsofsoc.supabase.co/storage/v1/object/public/images/profile/male.jpg";
const folder = 'profile';

export async function registerManager(info:any) {
    try {
        //Extract manager data
        const { firstname, lastname, gender, email, username, password } = info;
        const profile_img = (gender === 'M' || gender === 'Male') ? MALE_IMG_URL : FEMALE_IMG_URL;
        const newPass = await encryptPassword(password);
        
        const display_name = `${firstname} ${lastname}`;
        const role = "manager"; // Default role for customers
        //Check email duplication
        const { data: existingTrainer } = await supabase
        .from('manager')
        .select('email')
        .eq('email', email)
        .single();

        if (existingTrainer) {
            return {
                success: false,
                message: "This email address is already in use. Please use a different email.",
            };
        }

        //Store manager data to the database
        const { data: managerInfo, error } = await supabase
            .from('manager')
            .insert([
                { 
                    firstname: firstname,
                    lastname: lastname,
                    gender: gender,
                    email: email,
                    username: username,
                    password: newPass, 
                    profile_img: profile_img
                }
            ])
            .select('manager_id')  // Ensure that manager_id is returned after insert
            .single();  // Ensure we get only one record

        if (error) {
            return {
                success: false,
                message: "Failed to register manager. Please try again.",
                error: error.message
            };
        }

        const managerId = managerInfo.manager_id;
        // Register customer in Supabase Auth with display_name, role, and customer_id
        const { data, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    display_name: display_name,
                    role: role,
                    id: managerId, // Attach the customer_id to the user metadata
                },
            },
        });

        if (authError) {
            return {
                success: false,
                message: "Failed to register customer in authentication system.",
                error: authError.message,
            };
        }

        const { user } = data;
        return {
            success: true,
            message: "Customer registered successfully.",
            user_id: user?.id,
            manager_id: managerId,
        };
    } catch (error:any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}

export async function getManagerInfo(id : any) {
    try {
        //Get manager information
        const {data, error} = await supabase
        .from('manager')
        .select()
        .eq('manager_id',id);

        if(error) {
            return {
                success: false,
                message: 'Error fetching manager data.'
            }
        }
        return {
            success: true,
            message: 'Manager data retrieved successfully.',
            manager: data
        }
    } catch (error:any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}

export async function updateManagerInfo(data: FormData) {
    try {
        // Extract data
        const firstname = data.get('firstName') as string;
        const lastname = data.get('lastName') as string;
        const email = data.get('email') as string;
        const username = data.get('username') as string;
        const gender = data.get('gender') as string;
        const id = Number(data.get('id')); 
        const image = data.get('photo') as File | null;

        // Get manager information
        const { data: managerInfo, error: managerError } = await supabase
            .from('manager')
            .select('profile_img') 
            .eq('manager_id', id)
            .single();

        if (managerError) {
            return { success: false, message: 'Error fetching manager data.' };
        }

        // Check for email duplication
        const { data: emailExists, error: emailError } = await supabase
            .from('manager')
            .select('email')
            .eq('email', email)
            .neq('manager_id', id)
            .single();

        if (emailExists) {
            return { success: false, message: 'This email address is already in use by another manager. Please use a different email.' };
        }

        const currentImage = managerInfo.profile_img;
        let imageUrl = currentImage;

        // Upload image if provided
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

        const updatedInfo = {
            firstname,
            lastname,
            email,
            username,
            gender,
            profile_img: imageUrl,
        };

        // Update manager info in the database
        const { error: updateError } = await supabase
            .from('manager')
            .update(updatedInfo)
            .eq('manager_id', id);

        if (updateError) {
            return { success: false, message: 'Failed to update manager info.', error: updateError.message };
        }

        const { error: authError } = await supabase.auth.updateUser({
            email: email, // The new password
          });
      
          if (authError) {
            console.error('Error updating password in Supabase Authentication:', authError);
            return { success: false, message: 'Failed to update password in Supabase Authentication' };
          }

        return { success: true, message: 'Manager info updated successfully.' };
    } catch (error: any) {
        return { success: false, message: 'An unexpected error occurred.', error: error.message };
    }
}
