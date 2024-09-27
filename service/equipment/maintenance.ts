import supabase from "../../database/db";

export async function addMaintenance(data:any) {
    try {
        const {equipment_id, maintenance_date } = data;
        //insert equipment maintenance data
        const {error} = await supabase
        .from('maintenance')
        .insert([
            {
                equipment_id : equipment_id,
                maintenance_date : maintenance_date
            }
        ]).select();

        if(error) {
            return {
                success: false,
                message: "Failed to add equipment maintenance. Please try again.",
                error: error.message
            };
        }
        return { success: true, message: "Equipment Maintenance added successfully"};
    } catch (error: any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}

export async function getMaintenanceData() {
    try {
        //fetch equipment maintenance data
        const {data, error} = await supabase
        .from('maintenance')
        .select()

        if(error) {
            return { success: false, message: "An error occurred while fetching the data.", error: error.message }; 
        }
        return { success: true, message: "Equipment maintenance fetch successfully", data};
    } catch (error: any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}
