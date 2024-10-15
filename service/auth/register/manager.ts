import supabase from "../../../database/db";
import supabaseAdmin from "../../../database/dbAdmin";
import { encryptPassword } from "../../encryption/hash";
import { uploadImage,getFilePathFromUrl,removeImage} from "@service/imageUpload/imageUploader";

const FEMALE_IMG_URL = "https://mplhgifjydkvnfsofsoc.supabase.co/storage/v1/object/public/images/profile/female.jpg";
const MALE_IMG_URL = "https://mplhgifjydkvnfsofsoc.supabase.co/storage/v1/object/public/images/profile/male.jpg";
const folder = 'profile';

export async function registerManager(info:any) {
    try {
        //Extract manager data
        const { firstname, lastname, gender, email, username, password } = info;
        const profile_img = (gender === 'male' || gender === 'female') ? MALE_IMG_URL : FEMALE_IMG_URL;
        const newPass = await encryptPassword(password);
        
        const display_name = `${firstname} ${lastname}`;
        const role = "manager"; // Default role for customers
        //Check email duplication
        
        const valid = await checkEmail(email);

        if (!valid) {
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
        const { data, error: authError } = await supabaseAdmin.auth.signUp({
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
            console.error('Failed to register manager in Supabase Auth:', authError.message);
            return {
              success: false,
              message: "Failed to register manager in the authentication system.",
              error: authError.message,
            };
        }
        
        const { user } = data;

        const { error: updateError } = await supabase
        .from('manager')
        .update({ uuid: user?.id }) // Add user_id to the manager table
        .eq('manager_id', managerId); // Match with manager_id

        if (updateError) {
            return {
              success: false,
              message: 'Failed to update manager with UUID.',
              error: updateError.message,
            };
        }
        
        return {
            success: true,
            message: "Manager registered successfully.",
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
            .select('email, profile_img, uuid') 
            .eq('manager_id', id)
            .single();

        if (managerError) {
            return { success: false, message: 'Error fetching manager data.' };
        }

        const currentEmail = managerInfo.email;
        const currentImage = managerInfo.profile_img;
        const uuid = managerInfo.uuid;

         // Check if the email has changed
         if (email !== currentEmail) {
            const emailIsValid = await checkEmail(email);
            if (!emailIsValid) {
                return {
                    success: false,
                    message: 'This email address is already in use by another user. Please use a different email.',
                };
            }
        }

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

        const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(uuid, {
            email
        });
          
        if (authError) {
        console.error('Error updating user in Supabase Auth:', authError);
        return { success: false, message: 'Failed to update user in Supabase Auth', error: authError };
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
        return { success: true, message: 'Manager info updated successfully.' };
    } catch (error: any) {
        return { success: false, message: 'An unexpected error occurred.', error: error.message };
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
    } 

    return true;
    
}