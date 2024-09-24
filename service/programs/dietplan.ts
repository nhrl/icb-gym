import supabase from "../../database/db";
import { getFilePathFromUrl, removeImage, uploadImage } from "@service/imageUpload/imageUploader";

//Dietpan images directory folder
const folder = 'dietplan';

export async function addDietPlan(data:any) {
    try {

        const name = data.get('name') as string
        const description = data.get('description') as string
        const fitness_goal = data.get('fitness_goal') as string
        const file = data.get('image') as File

        //upload image
        const imageUrl = await uploadImage(file,folder);

        //Insert diet plan data to the database
        const {error: programError} = await supabase
        .from('dietplan')
        .insert([
            {
                name: name,
                description: description,
                fitness_goal: fitness_goal,
                dietplan_img: imageUrl
            }
        ])

        if(programError) {
            return {
                success: false,
                message: "Failed to add new diet plan.",
                error: programError.message
            }
        }
        return{success: true, message: "New Diet plan added Successfully"};
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
        const file = data.get('image') as File
        const id = Number(data.get('id'));
        
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

export async function removeDietPlan(id:number) {
    try {
        //get dietplan data
        const {data, error: fetchError} = await supabase
        .from('dietplan')
        .select('dietplan_img')
        .eq('dietplan_id',id)

        if(fetchError) {
            return {
                success: false,
                message: 'Failed to fetch program data.',
                error: fetchError.message
            }
        }

         //Delete image from storage
         let fileName: string;
         if (data && data.length > 0) {
             const path = data[0].dietplan_img;
             fileName = getFilePathFromUrl(path);
             // Remove the image from storage
             const imageRemovalResult = await removeImage(fileName);
             if (!imageRemovalResult.success) {
                 return {
                     success: false,
                     message: "Error removing image from the storage",
                 }
             }
         } else {
             return { 
                 message: "No program found with the given ID" 
             };
         }
 
        const {error} = await supabase
        .from('dietplan')
        .delete()
        .eq('dietplan_id',id)

        if(error) {
            return {
                success: false,
                message: 'Failed to remove diet plan.'
            }
        } 
        return {success: true, message: 'Diet plan remove successfully'}
    } catch (error:any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}