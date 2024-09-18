import supabase from "../../database/db";
import { uploadImage, getFilePathFromUrl, removeImage } from "@service/imageUpload/imageUploader";

//Workout folder directory
const folder = 'workout';
export async function addProgram(data : any) {
    try {
        const title = data.get('title') as string
        const description = data.get('description') as string
        const fitness_level = data.get('fitness_level') as string
        const fitness_goal = data.get('fitness_goal') as string
        const file = data.get('image') as File;

        //upload image
        const imageUrl = await uploadImage(file,folder);
        
        //Insert data to the database
        const {error: programError} = await supabase
        .from('program')
        .insert([
            {
                title: title,
                description: description,
                fitness_level: fitness_level,
                fitness_goal: fitness_goal,
                program_img: imageUrl
            }
        ])

        if(programError) {
            return {
                success: false,
                message: "Failed to add new program.",
                error: programError.message
            }
        }
        return{success: true, message: "New Program added Successfully"};
    } catch (error:any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}   

export async function getProgram() {
    try {
        const {data, error} = await supabase
        .from('program')
        .select();

        if(error) {
            return {
                success: false,
                message:'Error fetching program data'
            }
        }
        return {success: true, message: 'Data retrived successfully.', program: data};
    } catch (error:any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}

export async function updateProgram(data:any) {
    try {
        const title = data.get('title') as string
        const description = data.get('description') as string
        const fitness_level = data.get('fitness_level') as string
        const fitness_goal = data.get('fitness_goal') as string
        const file = data.get('image') as File;
        const id = Number(data.get('id'));

        //fetch program to be updated
        const {data: program, error: fetchError} = await supabase
        .from('program')
        .select('program_img')
        .eq('program_id',id)
        .single()

        if(fetchError) {
            return {
                success: false,
                message: 'Failed to fetching program data.',
                error: fetchError.message
            }
        }

        //upload new file if provided
        let newImageUrl = program.program_img;
        if(file && file.size > 0) {
            const filePath = `${folder}/${file.name}`;
            const currentFilePath = getFilePathFromUrl(program.program_img);
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

        //updating program data
        const programInfo = {
            title: title,
            description: description,
            fitness_level: fitness_level,
            fitness_goal: fitness_goal,
            program_img: newImageUrl
        }

        const {error} = await supabase
        .from('program')
        .update(programInfo)
        .eq('program_id',id);

        if(error) {
            return {
                success: false,
                message: 'Failed to update program.',
                error: error.message
            }
        }

        return {success: true, message: 'Program updated successfully.'};
    } catch (error:any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}

export async function removeProgram(id:number) {
    try {
        //get program data
        const {data, error: fetchError} = await supabase
        .from('program')
        .select('program_img')
        .eq('program_id',id)

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
            const path = data[0].program_img;
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

        //Delete program data
        const {error} = await supabase
        .from('program')
        .delete()
        .eq('program_id',id)

        if(error) {
            return {
                success: false,
                message: 'Failed to remove program.'
            }
        } 
        return {success: true, message: 'Program remove successfully'}
    } catch (error:any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}