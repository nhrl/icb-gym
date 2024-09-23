import supabase from "../../database/db";

export async function addAssign(data:any) {
    try {
        const {service_id, trainer_id, time_availability, schedule, max_capacity, current_capacity, rate} = data;
        //insert to the assign trainer table
        const {error} = await supabase
        .from('assign_trainer')
        .insert([
            {
                service_id: service_id,
                trainer_id: trainer_id,
                time_availability: time_availability,
                schedule: schedule,
                max_capacity: max_capacity,
                current_capacity: current_capacity,
                rate:rate
            }
        ])

        if(error) {
            return {
                success: false,
                message: "Failed to assign trainer. Please try again.",
                error: error.message
            };
        }
        return { success: true, message: "Trainer assign successfully"};
    } catch (error:any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}

export async function getAssign() {
    try {
        // Query the assign table, joining with trainer and service tables
        const { data, error } = await supabase
            .from('assign_trainer')
            .select(`
                assign_id,
                time_availability,
                schedule,
                max_capacity,
                current_capacity,
                rate,
                trainer:trainer_id (
                    firstname, lastname
                ),
                service:service_id (
                    service_name
                )
            `);
        if (error) {
            return { success: false, message: "An error occurred while fetching the data.", error: error.message };
        }

        return { success: true, message: "Assign trainer fetch successfully", data};
    } catch (error:any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}

export async function updateAssign(data:any) {
    try {
        const {id, time_availability, schedule, max_capacity, current_capacity, rate} = data;

        //update assign data
        const updatedInfo = {
            time_availability,
            schedule,
            max_capacity,
            current_capacity,
            rate
        }

        const {error} = await supabase 
        .from('assign_trainer')
        .update(updatedInfo)
        .eq('assign_id',id)

        if(error) {
            return { success: false, message: 'Failed to update assign trainer info.', error: error.message };
        }
        return { success: true, message: "Assign trainer updated successfully"};
    } catch (error:any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}

export async function removeAssign(data:any) {
    try {
        const {id} = data;
        //remove data
        const {error} = await supabase
        .from('assign_trainer')
        .delete()
        .eq('assign_id',id);

        if(error) {
            return {
                success: false,
                message: "Failed to remove assign trainer. Please try again.",
                error: error.message
            };
        }
        return { success: true, message: "Assign trainer remove successfully"};
    } catch (error:any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}