import { getFilePathFromUrl, removeImage, uploadImage } from "@service/imageUpload/imageUploader";
import supabase from "../../database/db";

// For image folder directory
const folder = `workout/exercise`;

export async function addExercise(data:any) {
    try {
         // extract exercise data
         const program_id  = Number(data.get('program_id'));
         const exercise_name = data.get('exercise_name') as string;
         const exercise_description  = data.get('exercise_description') as string;
         const reps  = Number(data.get('reps'));
         const sets  = Number(data.get('sets'));
         const image = data.get('image') as File;
    
         //upload exercise image
         const imageUrl = await uploadImage(image,folder);
         
         //store data to the database
         const {error} = await supabase
         .from('exercise')
         .insert([
             {
                program_id: program_id,
                exercise_name: exercise_name,
                exercise_description: exercise_description,
                reps: reps,
                sets: sets,
                exercise_img : imageUrl
             }
         ])
 
         if(error) {
             return {
                 success: false,
                 message: "Failed to add exercise. Please try again.",
                 error: error.message
             };
         }
         return { success: true, message: "New exercise added successfully"};
    } catch (error:any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}

export async function getExercise(id: any) {
    try {
        const {data, error} = await supabase
        .from('exercise')
        .select()
        .eq('program_id',id)

        if(error) {
            return {
                success: false,
                message: "Failed to retrieve exercises. Please try again.",
                error: error.message
            };
        }
        return {
            success: true,
            message: "Exercises retrieved successfully",
            trainers: data
        };
    } catch (error:any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}

export async function updateExercise(data: any) {
    try {
         // extract exercise data
         const id  = Number(data.get('exercise_id'));
         const exercise_name = data.get('exercise_name') as string;
         const exercise_description  = data.get('exercise_description') as string;
         const reps  = Number(data.get('reps'));
         const sets  = Number(data.get('sets'));
         const image = data.get('image') as File;

         //get exercise data
        const {data: exercise, error} = await supabase
        .from('exercise')
        .select()
        .eq('exercise_id',id)
        .single();

        if(error) {
            return {
                success: false,
                message: "Error fetching exercise data",
                error: error.message
            }
        }

        //check if new image is provided
        let exercise_img = exercise.exercise_img;

        if(image && image.size > 0) {
            const filePath = `${folder}/${image.name}`;
            const currentFile = getFilePathFromUrl(exercise.exercise_img);

            if(currentFile != filePath) {
                const publicUrl = await uploadImage(image,folder);
                exercise_img = publicUrl;

                const {success, error:  removeImageError} = await removeImage(currentFile);

                if(!success) {
                    return {
                        message: "Removing old image from storage failed",
                        error: removeImageError
                    }
                }
            }
        }
        //Update exercise data
        const newExerciseInfo = {
            exercise_name,
            exercise_description,
            reps,
            sets,
            exercise_img
         }
 
         const {error: updateError} = await supabase
         .from('exercise')
         .update(newExerciseInfo)
         .eq('exercise_id',id)
 
         if(updateError) {
             return {
                 success: false,
                 message: "Failed to update exercise. Please try again.",
                 error: updateError.message
             };
         }
         return {success: true, message: "Exercise updated successfully"};
    } catch (error:any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}

export async function deleteExercise(data: any) {
    try {
        let fileName: string;
        const id = Number(data.get('id'));

        const {data: exerciseInfo, error} = await supabase
        .from('exercise')
        .select()
        .eq('exercise_id',id)

        if(error) {
            return {
                success: false,
                message: error.message
            }
        }

        //Remove exercise image
        if(exerciseInfo && exerciseInfo.length > 0) {
            const path = exerciseInfo[0].exercise_img;
            fileName = getFilePathFromUrl(path);
            const imageRemovalResult = await removeImage(fileName);

            if(!imageRemovalResult) {
                return {
                    success: false,
                    message: "Cannot delete exercise"
                }
            }
        } else {
            return {
                message: "Cannot find exercise"
            }
        }

        //Delete Exercise data
        const {error: deleteExerciseError} = await supabase
        .from('exercise')
        .delete()
        .eq('exercise_id',id);

        if(deleteExerciseError) {
            return {
                success: false,
                message: "Cannot delete exercise"
            }
        }
        return {
            success: true,
            message: "Exercise deleted successfully"
        }
    } catch (error:any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}