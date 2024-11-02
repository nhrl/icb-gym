import supabase from "../../../database/db";

export async function getStreak(id: any) {
    try {
        const {data, error} = await supabase
        .from('gymstreaktable')
        .select()
        .eq('customer_id',id)
        .single();
        
        if(error) {
            return {
                success: false,
                message: "Error fecthing streak",
                error: error.message
            }
        }
        
        return {
            success: true,
            message: "Successfully fetch your streak",
            data:data
        }
    } catch (error: any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}