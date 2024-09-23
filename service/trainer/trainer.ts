import { uploadImage, getFilePathFromUrl, removeImage } from "@service/imageUpload/imageUploader";
import supabase from "../../database/db";

// For image folder directory
const folder = `trainer`;

export async function addTrainer(data:any) {
    try {
         //Extract Data
        const firstname = data.get('firstname') as string;
        const lastname = data.get('lastname') as string;
        const specialty = data.get('specialty') as string;
        const email = data.get('email') as string;
        const availability = data.get('availability') as string;
        const image = data.get('image') as File ;

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
        //Extract data
        const id = data.get('id') as number;
        const file = data.get('image') as File;
        const firstname = data.get('firstname') as string;
        const lastname = data.get('lastname') as string;
        const specialty = data.get('specialty') as string;
        const email = data.get('email') as string;
        const availability = data.get('availability') as string;

        //Get trainer
        const {data: trainer, error} = await supabase
        .from('trainer')
        .select()
        .eq('trainer_id',id)
        .single();

        if(error) {
            return {
                message: "Failed getting the trainer",
                error: error.message
            }
        }

        //Check if images is provided
        let trainer_img = trainer.trainer_img;
        if(file && file.size > 0) {
            //Upload new image
            const filePath = `${folder}/${file.name}`;
            const currentFile = getFilePathFromUrl(trainer.trainer_img);

            if(currentFile != filePath) {
                const publicUrl = await uploadImage(file,folder);
                trainer_img = publicUrl;

                const {success, error:  removeImageError} = await removeImage(currentFile);

                if(!success) {
                    return {
                        message: "Removing old image from storage failed",
                        error: removeImageError
                    }
                }
            }
        } 
        
        //Update trainer data
        const trainerData = {
            firstname,
            lastname,
            specialty,
            email,
            availability,
            trainer_img
        }

        const {error: updateError} = await supabase
        .from('trainer')
        .update(trainerData)
        .eq('trainer_id',id)

        if(updateError) {
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
        return {success: true, message: "Trainer updated successfully"};
    } catch (error:any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}


export async function deleteTrainer(id:number) {
    try {
        let fileName: string;

        //Get trainer data
        const { data, error } = await supabase
            .from('trainer')
            .select()
            .eq('trainer_id', id);
    
        if(error) {
            return {
                success: false,
                message: error.message
            }
        }
    
        //Remove trainer image
        if(data && data.length > 0) {
            const path = data[0].trainer_img;
            fileName = getFilePathFromUrl(path);
            const imageRemovalResult = await removeImage(fileName);
    
            if(!imageRemovalResult) {
                return {
                    success: false,
                    message: "Cannot delete trainer"
                }
            }
        } else {
            return {
                message: "Cannot find trainer"
            }
        }
    
        //Delete trainer data
        const {error: deleteTrainerError} = await supabase
            .from('trainer')
            .delete()
            .eq('trainer_id',id);
        
        if(deleteTrainerError) {
            return {
                success: false,
                message: "Cannot delete trainer"
            }
        }
        return {
            success: true,
            message: "Trainer deleted successfully"
        }
    } catch (error:any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}
