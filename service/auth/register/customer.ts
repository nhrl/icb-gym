import supabase from "../../../database/db";
import supabaseAdmin from "../../../database/dbAdmin";
import { encryptPassword } from "../../encryption/hash";
import { getFilePathFromUrl, uploadImage, removeImage } from "@service/imageUpload/imageUploader";


const FEMALE_IMG_URL = "https://mplhgifjydkvnfsofsoc.supabase.co/storage/v1/object/public/images/profile/female.jpg";
const MALE_IMG_URL = "https://mplhgifjydkvnfsofsoc.supabase.co/storage/v1/object/public/images/profile/male.jpg";
const folder = 'profile';


// Register customer function
export async function registerCustomer(info: any) {
    try {
        // Extract customer data
        const { firstname, lastname, gender, email, username, password } = info;
        const profile_img = (gender === 'male' || gender === 'female') ? MALE_IMG_URL : FEMALE_IMG_URL;
        const newPass = await encryptPassword(password);

        // Combine firstname and lastname to create display name
        const display_name = `${firstname} ${lastname}`;
        const role = "customer"; // Default role for customers

        // Check email duplication
       const valid = await checkEmail(email);
    
        if (!valid) {
            return {
                success: false,
                message: "This email address is already in use. Please use a different email.",
            };
        }

        // Store customer data to the database and return customer_id
        const { data: insertedData, error: dbError } = await supabase
            .from('customer')
            .insert({
                firstname,
                lastname,
                gender,
                email,
                username,
                password: newPass, // Store the encrypted password
                profile_img,
                fitness_goals: "",
                time_preference: "",
                fitness_level: "",
            })
            .select('customer_id')  // Ensure that customer_id is returned after insert
            .single();  // Ensure we get only one record

        if (dbError) {
            return {
                success: false,
                message: "Failed to register customer in the database. Please try again.",
                error: dbError.message,
            };
        }

        const customerId = insertedData.customer_id;

        // Register customer in Supabase Auth with display_name, role, and customer_id
        const { data, error: authError } = await supabaseAdmin.auth.signUp({
            email,
            password,
            options: {
                data: {
                    display_name: display_name,
                    role: role,
                    id: customerId, // Attach the customer_id to the user metadata
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
        const { error: updateError } = await supabase

        .from('customer')
        .update({ uuid: user?.id }) // Add user_id to the manager table
        .eq('customer_id', customerId); // Match with customer_id

        if (updateError) {
            return {
              success: false,
              message: 'Failed to update manager with UUID.',
              error: updateError.message,
            };
        }
        
        return {
            success: true,
            message: "Customer registered successfully.",
            user_id: user?.id,
            customer_id: customerId,
        };
    } catch (error: any) {
        return {
            success: false,
            message: "An error occurred. Please try again.",
            error: error.message,
        };
    }
}


export async function getCustomerData(id:any) {
    try {
        //Get customer information
        const {data, error} = await supabase
        .from('customer')
        .select()
        .eq('customer_id',id);

        if(error) {
            return {
                success: false,
                message: 'Error fetching manager data.'
            }
        }
        return {
            success: true,
            message: 'Manager data retrieved successfully.',
            customer: data
        }
    } catch (error:any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}

export async function updateCustomerData(data : FormData) {
    try {
        // Extract data
        const firstname = data.get('firstname') as string;
        const lastname = data.get('lastname') as string;
        const email = data.get('email') as string;
        const id = Number(data.get('id')); 
        const image = data.get('image') as File | null;

        // Get customer information
        const { data: customerInfo, error: customerError } = await supabase
            .from('customer')
            .select('profile_img') 
            .eq('customer_id', id)
            .single();

        if (customerError) {
            return { success: false, message: 'Error fetching customer data.' };
        }

        // Check email duplication
        const valid = await checkEmail(email);
        
        if (!valid) {
            return {
                success: false,
                message: "This email address is already in use. Please use a different email.",
            };
        }

        const currentImage = customerInfo.profile_img;
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
            profile_img: imageUrl,
        };

        // Update manager info in the database
        const { error: updateError } = await supabase
            .from('customer')
            .update(updatedInfo)
            .eq('customer_id', id);

        if (updateError) {
            return { success: false, message: 'Failed to update customer info.', error: updateError.message };
        }

        return { success: true, message: 'Customer info updated successfully.' };
    } catch (error:any) {
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
    } else {
        return true;
    }
}