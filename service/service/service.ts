import supabase from "../../database/db";
import { getFilePathFromUrl, removeImage, uploadImage } from "@service/imageUpload/imageUploader";

// For image folder directory
const folder = `service`;
export async function addService(data:any) {
    try {
        //Extract service data
        const serviceName = data.get('serviceName') as string;
        const file = data.get('image') as File;

        //Upload Image
        const imageUrl = await uploadImage(file,folder);
        
        //Store to the database
        const { error } = await supabase
        .from('service')
        .insert([
            { 
                service_name:serviceName,
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
        const serviceName = data.get('serviceName') as string;
        const file = data.get('image') as File;

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
            service_img: newImageUrl 
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


export async function deleteService(id: number) {
    try {
        //Get service data
        const { data, error } = await supabase
        .from('service')
        .select()
        .eq('service_id', id);

        if (error) {
            return {
                success: false,
                message: "Error getting service data",
                error: error.message
            }
        }

        //Delete image from storage
        let fileName: string;
        if (data && data.length > 0) {
            const path = data[0].service_img;
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
                message: "No service found with the given ID" 
            };
        }

        //Delete service data
        const { error: deleteServiceError } = await supabase
        .from('service')
        .delete()
        .eq('service_id', id);

        if (deleteServiceError) {
            return {
                success: false,
                message: 'Error deleting the service data',
                error: deleteServiceError.message
            }
        }
        return { success: true, message: 'Service remove successfully'};
    } catch (error:any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}