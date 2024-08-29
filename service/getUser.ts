import supabase from "../database/db";

export async function getUser() {
    const { data, error } = await supabase
        .from('capstone')
        .select();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}