import { uploadImage, getFilePathFromUrl, removeImage } from "@service/imageUpload/imageUploader";
import supabase from "../../database/db";

// For image folder directory
const folder = `trainer`;

export async function addTrainer(data:any) {
    try {
         //Extract Data
        const firstname = data.get('firstName') as string;
        const lastname = data.get('lastName') as string;
        const specialty = data.get('speciality') as string;
        const email = data.get('email') as string;
        const availability = data.get('availability') as string;
        const image = data.get('photo') as File ;

        //Check email duplication
        const { data: existingTrainer } = await supabase
            .from('trainer')
            .select('email')
            .eq('email', email)
            .single();

        if (existingTrainer) {
            return {
                success: false,
                message: "This email address is already in use. Please use a different email.",
            };
        }

        // Add image to the storage
        const imageUrl = await uploadImage(image,folder);

        //Add trainer data to the database
        const {error} = await supabase
        .from('trainer')
        .insert([
            {
                firstname: firstname,
                lastname:lastname,
                specialty: specialty,
                email: email,
                availability: availability,
                trainer_img: imageUrl
            }
        ])

        if (error) {
            return {
                success: false,
                message: "Failed to add trainer. Please try again.",
                error: error.message
            };
        }
        return { success: true, message: "Trainer added successfully"};
    } catch (error:any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}

export async function getTrainer() {
    try {
        const { data, error } = await supabase
            .from('trainer')
            .select();

        // Check for any errors during the query
        if (error) {
            return {
                success: false,
                message: "Failed to retrieve trainers. Please try again.",
                error: error.message
            };
        }

        // Return the data with a success message if everything went well
        return {
            success: true,
            message: "Trainers retrieved successfully",
            trainers: data
        };
    } catch (error: any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}

export async function updateTrainer(data: any) {
    try {
        // Extract data
        const id = data.get('id') as number;
        const file = data.get('photo') as File;
        const firstname = data.get('firstName') as string;
        const lastname = data.get('lastName') as string;
        const specialty = data.get('speciality') as string;
        const email = data.get('email') as string;
        const availability = data.get('availability') as string;

        // Get trainer
        const { data: trainer, error } = await supabase
            .from('trainer')
            .select()
            .eq('trainer_id', id)
            .single();

        if (error) {
            return {
                message: "Failed getting the trainer",
                error: error.message
            };
        }

        // Check if image is provided or the existing image is missing
        let trainer_img = trainer?.trainer_img;  // Handle case where trainer_img is null or undefined
        if (file && file.size > 0) {
            const filePath = `${folder}/${file.name}`;

            // Only try to get the current file path if trainer_img is valid (non-null)
            let currentFile = trainer_img ? getFilePathFromUrl(trainer_img) : null;

            // If there is no existing image, or the image is different, upload the new one
            if (!trainer_img || currentFile !== filePath) {
                const publicUrl = await uploadImage(file, folder);
                trainer_img = publicUrl;  // Set the new image URL

                // If an old image exists, attempt to remove it
                if (currentFile) {
                    const { success, error: removeImageError } = await removeImage(currentFile);
                    if (!success) {
                        return {
                            message: "Removing old image from storage failed",
                            error: removeImageError
                        };
                    }
                }
            }
        }

        // Update trainer data
        const trainerData = {
            firstname,
            lastname,
            specialty,
            email,
            availability,
            trainer_img
        };

        const { error: updateError } = await supabase
            .from('trainer')
            .update(trainerData)
            .eq('trainer_id', id);

        if (updateError) {
            if (updateError.message.includes('duplicate key value')) {
                if (updateError.message.includes('trainer_email_key')) {
                    return {
                        success: false,
                        message: "This email address is already in use. Please use a different email."
                    };
                }
            }
            return {
                success: false,
                message: "Failed to update trainer. Please try again.",
                error: updateError.message
            };
        }
        return { success: true, message: "Trainer updated successfully" };
    } catch (error: any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}

export async function deleteTrainer(info: any) {
    try {
        const { ids } = info;

        // Fetch trainer data for each ID to get the image paths
        const { data, error } = await supabase
            .from('trainer')
            .select('trainer_id, trainer_img')
            .in('trainer_id', ids); // Use 'in' to get trainers matching the provided ids

        if (error) {
            return {
                success: false,
                message: "Error getting trainer data",
                error: error.message
            };
        }

        if (!data || data.length === 0) {
            return {
                success: false,
                message: "No trainers found with the given IDs"
            };
        }

        // Loop through each trainer and delete associated images
        for (const trainer of data) {
            const path = trainer.trainer_img; // Get the image path
            if (path && path.trim() !== "") {
                // Only proceed if trainer_img is not empty or null
                const fileName = getFilePathFromUrl(path); // Extract the file name from the URL
                // Remove the image from storage
                const imageRemovalResult = await removeImage(fileName);
                if (!imageRemovalResult.success) {
                    return {
                        success: false,
                        message: `Error removing image ${fileName} from storage`
                    };
                }
            } else {
                console.log(`No image found for trainer with ID: ${trainer.trainer_id}, skipping image removal...`);
            }
        }

        // Now delete all the trainer records from the database
        const { error: deleteTrainersError } = await supabase
            .from('trainer')
            .delete()
            .in('trainer_id', ids); // Delete all trainers with the provided ids

        if (deleteTrainersError) {
            return {
                success: false,
                message: 'Error deleting the trainer data',
                error: deleteTrainersError.message
            };
        }

        return { success: true, message: 'Trainers and associated images removed successfully' };
    } catch (error: any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}
