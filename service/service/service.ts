import supabase from "../../database/db";
import { getFilePathFromUrl, removeImage, uploadImage } from "@service/imageUpload/imageUploader";

// For image folder directory
const folder = `service`;
export async function addService(data:any) {
    try {
        //Extract service data
        const serviceName = data.get('name') as string;
        const desc = data.get('desc') as string;
        const file = data.get('photo') as File;

        //Upload Image
        const imageUrl = await uploadImage(file,folder);
        
        //Store to the database
        const { error } = await supabase
        .from('service')
        .insert([
            { 
                service_name:serviceName,
                desc:desc,
                service_img:imageUrl  
            }
        ]);

        if(error) {
            return {
                success: false,
                message: "Error adding service ",
                error: error.message
            }
        }
        return {success: true, message: "New service added successfully"}
    } catch (error:any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}

export async function getService() {
    try {
        const { data, error } = await supabase
        .from('service')
        .select();
    
        if (error) {
           return {
                success: false,
                message: "Error getting service data",
                error: error.message
           }
        }
        return {success: true, message: "Service data fetch successfully", data: data}; 
    } catch (error:any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
    
}

export async function updateService(data:any) {
    try {
        //extract service data
        const serviceId = data.get('id') as number;
        const serviceName = data.get('name') as string;
        const desc = data.get('desc') as string;
        const file = data.get('photo') as File;

        const { data: currentServiceData, error: fetchError } = await supabase
            .from('service')
            .select('service_img')
            .eq('service_id', serviceId)
            .single();

        if (fetchError) {
            return {
                success: false,
                message: 'Error fetching service data',
                error: fetchError.message
            }
        }
        
        //Upload new service image in the storage
        let newImageUrl = currentServiceData.service_img;

        if (file && file.size > 0) {
            const filePath = `${folder}/${file.name}`;
            const currentFilePath = getFilePathFromUrl(currentServiceData.service_img); 

            if (currentFilePath !== filePath) {
                const publicUrl = await uploadImage(file, folder);
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

        //Updateting service data
        const updateServiceData = {
            service_name: serviceName,
            service_img: newImageUrl,
            desc: desc 
        };

        const { error: updateError } = await supabase
            .from('service')
            .update(updateServiceData)
            .eq('service_id', serviceId);

        if (updateError) {
            return {
                success: false,
                message: "Error updating service data",
                error: updateError?.message
            }
        }
        return { success: true, message: "Service updated successfully"};
    } catch (error: any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}


export async function deleteService(info: any) {
    try {
        const {ids} = info;
        // Fetch service data for each ID to get the image paths
        const { data, error } = await supabase
            .from('service')
            .select('service_id, service_img')
            .in('service_id', ids); // Use 'in' to get services matching the provided ids
        if (error) {
            return {
                success: false,
                message: "Error getting service data",
                error: error.message
            };
        }
        
        if (!data || data.length === 0) {
            return {
                success: false,
                message: "No services found with the given IDs"
            };
        }

        // Loop through each service and delete associated images
        for (const service of data) {
            const path = service.service_img; // Get the image path
            const fileName = getFilePathFromUrl(path); // Extract the file name from the URL

            // Remove the image from storage
            const imageRemovalResult = await removeImage(fileName);
            if (!imageRemovalResult.success) {
                return {
                    success: false,
                    message: `Error removing image ${fileName} from storage`
                };
            }
        }

        // Now delete all the service records from the database
        const { error: deleteServicesError } = await supabase
            .from('service')
            .delete()
            .in('service_id', ids); // Delete all services with the provided ids

        if (deleteServicesError) {
            return {
                success: false,
                message: 'Error deleting the service data',
                error: deleteServicesError.message
            };
        }

        return { success: true, message: 'Services and associated images removed successfully' };
    } catch (error: any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}