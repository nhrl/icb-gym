import supabase from "../../database/db";

export async function addEquipment(data:any) {
    try {
        const {name, quantity, purchase_date } = data;
        //insert equipment data
        const {error} = await supabase
        .from('equipment')
        .insert([
            {
                name: name,
                quantity: quantity,
                purchase_date: purchase_date
            }
        ])

        if(error) {
            return {
                success: false,
                message: "Failed to add equipment. Please try again.",
                error: error.message
            };
        }
        return { success: true, message: "New Equipment added successfully"};
    } catch (error: any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}

export async function getEquipment() {
    try {
        //fetch equipment data
        const {data, error} = await supabase
        .from('equipment')
        .select()

        if(error) {
            return { success: false, message: "An error occurred while fetching the data.", error: error.message }; 
        }
        return { success: true, message: "Equipment fetch successfully", data};
    } catch (error: any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}

export async function updateEquipment(data:any) {
    try {
        const {id, name, quantity, purchase_date } = data;

        const equipmentInfo = {
            name,
            quantity,
            purchase_date
        }

        //update equipment
        const {error} = await supabase
        .from('equipment')
        .update(equipmentInfo)
        .eq('equipment_id', id)

        if(error) {
            return { success: false, message: 'Failed to update equipment info.', error: error.message };
        }
        return { success: true, message: "Equipment updated successfully"};
    } catch (error: any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}

export async function deleteEquipment(data:any) {
    try {
        const {id} = data;
        //remove equipment
        const {error} = await supabase
        .from('equipment')
        .delete()
        .eq('equipment_id', id)

        if(error) {
            return {
                success: false,
                message: "Failed to remove equipment. Please try again.",
                error: error.message
            };
        }
        return { success: true, message: "Equipment remove successfully"};
    } catch (error: any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}