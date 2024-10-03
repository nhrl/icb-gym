import supabase from "../../database/db";
import { getFilePathFromUrl, removeImage, uploadImage } from "@service/imageUpload/imageUploader";

//Dietpan images directory folder
const folder = 'dietplan';

export async function addDietPlan(data:any) {
    try {

        const name = data.get('name') as string
        const description = data.get('desc') as string
        const fitness_goal = data.get('fitness_goal') as string
        const file = data.get('photo') as File

        //upload image
        const imageUrl = await uploadImage(file,folder);

        //Insert diet plan data to the database
        const {data: dietplanInfo , error: programError} = await supabase
        .from('dietplan')
        .insert([
            {
                name: name,
                description: description,
                fitness_goal: fitness_goal,
                dietplan_img: imageUrl
            }
        ])
        .select()
        .single()

        if(programError) {
            return {
                success: false,
                message: "Failed to add new diet plan.",
                error: programError.message
            }
        }
        return{success: true, message: "New Diet plan added Successfully", data: dietplanInfo};
    } catch (error:any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}

export async function getDietPlan() {
    try {
        const {data, error} = await supabase
        .from('dietplan')
        .select();

        if(error) {
            return {
                success: false,
                message:'Error fetching diet plan data'
            }
        }
        return {success: true, message: 'Data retrived successfully.', dietplan: data};
    } catch (error:any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}

export async function updateDietPlan(data:any) {
    try {
        const name = data.get('name') as string
        const description = data.get('description') as string
        const fitness_goal = data.get('fitness_goal') as string
        const file = data.get('photo') as File
        const id = Number(data.get('program_id'));
        
        //fetch dietplan to be updated
        const {data: dietplan, error: fetchError} = await supabase
        .from('dietplan')
        .select('dietplan_img')
        .eq('dietplan_id',id)
        .single()

        if(fetchError) {
            return {
                success: false,
                message: 'Failed to fetching program data.',
                error: fetchError.message
            }
        }

        //upload new file if provided
        let newImageUrl = dietplan.dietplan_img;
        if(file && file.size > 0) {
            const filePath = `${folder}/${file.name}`;
            const currentFilePath = getFilePathFromUrl(dietplan.dietplan_img);
            if(filePath != currentFilePath) {
                const publicUrl = await uploadImage(file,folder);
                newImageUrl = publicUrl;

                const { success, error: removalError } = await removeImage(currentFilePath);
                if (!success) {
                    return {
                        success: false,
                        message: "Error removing old image from storage"
                    }
                }
            }
        }
        
        //updating dietplan data
        const dietplanInfo = {
            name: name,
            description: description,
            fitness_goal: fitness_goal,
            dietplan_img: newImageUrl
        }

        const {error} = await supabase
        .from('dietplan')
        .update(dietplanInfo)
        .eq('dietplan_id',id);

        if(error) {
            return {
                success: false,
                message: 'Failed to update diet plan.',
                error: error.message
            }
        }

        return {success: true, message: 'Diet Plan updated successfully.'};
    } catch (error:any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}

export async function removeDietPlan(info: any) {
    try {
        //get dietplan data
        const { ids } = info; // ids should be an array of program IDs
        // Fetch program data for each ID to get the image paths
        const { data, error: fetchError } = await supabase
            .from('dietplan')
            .select('dietplan_id, dietplan_img')
            .in('dietplan_id', ids); // Use 'in' to get programs matching the provided ids

        if (fetchError) {
            return {
                success: false,
                message: 'Failed to fetch program data.',
                error: fetchError.message
            };
        }

        if (!data || data.length === 0) {
            return {
                success: false,
                message: "No dietplan found with the given IDs"
            };
        }
         // Loop through each program and delete associated images
         for (const dietplan of data) {
            const path = dietplan.dietplan_img; // Get the image path
            if (path && path.trim() !== "") {
                // Only proceed if program_img is not empty or null
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
                console.log(`No image found for program with ID: ${dietplan.dietplan_id}, skipping...`);
            }
        }
        
         // delete all the program records from the database
         const { error: deleteProgramsError } = await supabase
         .from('dietplan')
         .delete()
         .in('dietplan_id', ids); // Delete all programs with the provided ids

        if (deleteProgramsError) {
            return {
                success: false,
                message: 'Error deleting the program data',
                error: deleteProgramsError.message
            };
        }
        return {success: true, message: 'Diet plan remove successfully'}
    } catch (error:any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}