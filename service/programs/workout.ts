import supabase from "../../database/db";
import { uploadImage, getFilePathFromUrl, removeImage } from "@service/imageUpload/imageUploader";

//Workout folder directory
const folder = 'workout';
export async function addProgram(data : any) {
    try {
        const title = data.get('title') as string
        const description = data.get('desc') as string
        const fitness_level = data.get('fitness_level') as string
        const fitness_goal = data.get('fitness_goal') as string
        const file = data.get('photo') as File;

        //upload image
        const imageUrl = await uploadImage(file,folder);
        //Insert data to the database
        const {data: program, error: programError} = await supabase
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
        .select()
        .single();

        if(programError) {
            return {
                success: false,
                message: "Failed to add new program.",
                error: programError.message
            }
        }
        return{success: true, message: "New Program added Successfully", data: program};
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
        const id = Number(data.get('program_id'));

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

export async function removePrograms(info: any) {
    try {
        const { ids } = info; // ids should be an array of program IDs
        // Fetch program data for each ID to get the image paths
        const { data, error: fetchError } = await supabase
            .from('program')
            .select('program_id, program_img')
            .in('program_id', ids); // Use 'in' to get programs matching the provided ids

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
                message: "No programs found with the given IDs"
            };
        }

        // Loop through each program and delete associated images
        for (const program of data) {
            const path = program.program_img; // Get the image path
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
                console.log(`No image found for program with ID: ${program.program_id}, skipping...`);
            }
        }

        // delete all the program records from the database
        const { error: deleteProgramsError } = await supabase
            .from('program')
            .delete()
            .in('program_id', ids); // Delete all programs with the provided ids

        if (deleteProgramsError) {
            return {
                success: false,
                message: 'Error deleting the program data',
                error: deleteProgramsError.message
            };
        }

        return { success: true, message: 'Programs and associated images removed successfully' };
    } catch (error: any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}
