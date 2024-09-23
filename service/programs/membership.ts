import supabase from "../../database/db";

export async function addMembership(data: any) {
    try {   
        const {membership_type, validity_period, rate} = data;
        //add membership data
        const {error} = await supabase
        .from('membership')
        .insert([
            {
                membership_type: membership_type,
                validity_period: validity_period,
                rate: rate
            }
        ])

        if(error) {
            return {
                success: false,
                message: "Failed to add membership. Please try again.",
                error: error.message
            };
        }
        return { success: true, message: "New Membership added successfully"};
    } catch (error:any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}

export async function getMembership() {
    try {
        // fetch memership data
        const {data, error} = await supabase
        .from('membership')
        .select()

        if(error) {
            return { success: false, message: "An error occurred while fetching the data.", error: error.message };
        }
        return { success: true, message: "Membership fetch successfully", data};
    } catch (error:any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}

export async function updateMembership(data: any) {
    try {
        const {id, membership_type, validity_period, rate} = data;

        const membershipInfo = {
            membership_type,
            validity_period,
            rate
        }

        //update membership
        const {error} = await supabase
        .from('membership')
        .update(membershipInfo)
        .eq('membership_id', id)

        if(error) {
            return { success: false, message: 'Failed to update membership info.', error: error.message };
        }
        return { success: true, message: "Membership updated successfully"};
    } catch (error:any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}

export async function deleteMembership(data: any) {
    try {
        const {id} = data;
        //remove membership
        const {error} = await supabase
        .from('membership')
        .delete()
        .eq('membership_id', id)

        if(error) {
            return {
                success: false,
                message: "Failed to remove membership. Please try again.",
                error: error.message
            };
        }
        return { success: true, message: "Membership remove successfully"};
    } catch (error: any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}