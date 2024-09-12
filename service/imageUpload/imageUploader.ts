import supabase from "../../database/db";

export async function uploadImage(file: File, folderPath: string): Promise<string | null> {
    try {
        // Construct the initial file path
        let filePath = `${folderPath}/${file.name}`;

        // Check if the file already exists in storage
        const { data: existingFile } = await supabase
            .storage
            .from('images')
            .list(folderPath, { search: file.name });

        // If a file with the same name exists, modify the file name by adding a timestamp
        let finalFilePath = filePath;
        if (existingFile && existingFile.length > 0) {
            const timestamp = Date.now();
            const extension = file.name.split('.').pop(); // Get the file extension
            const baseName = file.name.replace(`.${extension}`, ''); // Get the base name of the file
            finalFilePath = `${folderPath}/${baseName}-${timestamp}.${extension}`; // Append timestamp to make the file name unique
        }

        // Upload the image to Supabase
        const { error } = await supabase
            .storage
            .from('images')
            .upload(finalFilePath, file);

        if (error) {
            console.error("Error uploading file:", error);
            return null;
        }

        // Get the public URL of the uploaded file
        const { data: publicUrlData } = supabase
            .storage
            .from('images')
            .getPublicUrl(finalFilePath);

        if (!publicUrlData) {
            console.error("Error retrieving public URL for the file");
            return null;
        }

        return publicUrlData.publicUrl;

    } catch (error) {
        console.error("Error uploading image:", error);
        return null;
    }
}

export function getFilePathFromUrl(url: string): string {
    const baseUrl = 'https://mplhgifjydkvnfsofsoc.supabase.co/storage/v1/object/public/images/';
    return url.replace(baseUrl, '').split('?')[0];
}

export async function removeImage(fileName: string): Promise<{ success: boolean; error?: string }> {
    console.log("File to be deleted:", fileName); 

    const { error } = await supabase
        .storage
        .from("images")
        .remove([fileName]);

    if (error) {
        console.error("Error deleting file from storage:", error);
        return { success: false, error: error.message };
    }

    return { success: true };;
}