import { uploadImage, getFilePathFromUrl, removeImage } from "@service/imageUpload/imageUploader";
import supabase from "../../database/db";

// For image folder directory
const folder = `dietplan/meals`;

export async function addMeal(meal: any) {
    try {
      const dietplan_id = Number(meal.get('dietplanId'));
      const mealName =  meal.get('meal') as string;
      const food = meal.get('food') as string;
      const food_desc = meal.get('food_desc') as string;
      const recipe = meal.get('ingredients') as string;
      const food_prep = meal.get('preparation') as string;
      const protein = Number(meal.get('protein'));
      const carbohydrates = Number(meal.get('carbs'));
      const fats = Number(meal.get('fats'));
      const calories = Number(meal.get('calories'));
      const image = meal.get('photo') as File;
  
      // If an image is provided, upload it
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImage(image, folder); // Assuming folder is defined elsewhere
      }

      // Insert the meal data into the 'meal' table
      const { error } = await supabase.from('meal').insert({
        dietplan_id: dietplan_id,
        meal_name: mealName,
        dish: food,
        food_desc: food_desc,
        ingredients: recipe,
        food_prep: food_prep,
        protein: protein,
        carbohydrates: carbohydrates,
        fats: fats,
        calories: calories,
        meal_img: imageUrl || null, // Use uploaded image URL or set null if no image
      });
  
      if (error) {
        return {
          success: false,
          message: "Failed to add the meal. Please try again.",
          error: error.message,
        };
      }
      return { success: true, message: "Meal added successfully." };
    } catch (error: any) {
      return {
        success: false,
        message: "An error occurred. Please try again.",
        error: error.message,
      };
    }
  }
  
  
export async function getMeal(id: any) {
    try {
        const {data, error} = await supabase
        .from('meal')
        .select()
        .eq('dietplan_id', id)

        if(error) {
            return {
                success: false,
                message: "Failed to retrieve meals. Please try again.",
                error: error.message
            };
        }
        return {
            success: true,
            message: "Meals retrieved successfully",
            data: data
        };
    } catch (error:any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}

export async function updateMeal(data: any) {
    try {
        //extract meal data
        const id = Number(data.get('id'));
        const meal = data.get('meal') as string;
        const food = data.get('food') as string;
        const food_desc = data.get('food_desc') as string;
        const recipe = data.get('recipe') as string;
        const food_prep = data.get('food_prep') as string;
        const protein = Number(data.get('protein'));
        const carbohydrates = Number(data.get('carbohydrates'));
        const fats = Number(data.get('fats'));
        const calories = Number(data.get('calories'));
        const image = data.get('image') as File;

        //get meal data
        const {data: mealInfo, error} = await supabase
        .from('meal')
        .select()
        .eq('meal_id',id)
        .single();

        if(error) {
            return {
                success: false,
                message: "Error fetching meal data",
                error: error.message
            }
        }
        //check if new image is provided
        let meal_img = mealInfo.meal_img;

        if(image && image.size > 0) {
            const filePath = `${folder}/${image.name}`;
            const currentFile = getFilePathFromUrl(mealInfo.meal_img);

            if(currentFile != filePath) {
                const publicUrl = await uploadImage(image,folder);
                meal_img = publicUrl;

                const {success, error:  removeImageError} = await removeImage(currentFile);

                if(!success) {
                    return {
                        message: "Removing old image from storage failed",
                        error: removeImageError
                    }
                }
            }
        }

        //Update trainer data
        const newMealInfo = {
           meal,
           food,
           food_desc,
           recipe,
           food_prep,
           protein,
           carbohydrates,
           fats,
           calories,
           meal_img
        }

        const {error: updateError} = await supabase
        .from('meal')
        .update(newMealInfo)
        .eq('meal_id',id)

        if(updateError) {
            return {
                success: false,
                message: "Failed to update meal. Please try again.",
                error: updateError.message
            };
        }
        return {success: true, message: "Meal updated successfully"};
    } catch (error:any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }   
}

export async function removeMeal(data: any) {
    try {
        let fileName: string;
        const id = Number(data.get('id'));

        const {data: mealInfo, error} = await supabase
        .from('meal')
        .select()
        .eq('meal_id',id)

        if(error) {
            return {
                success: false,
                message: error.message
            }
        }

        //Remove meal image
        if(mealInfo && mealInfo.length > 0) {
            const path = mealInfo[0].meal_img;
            fileName = getFilePathFromUrl(path);
            const imageRemovalResult = await removeImage(fileName);

            if(!imageRemovalResult) {
                return {
                    success: false,
                    message: "Cannot delete meal"
                }
            }
        } else {
            return {
                message: "Cannot find meal"
            }
        }

        //Delete Meal data
        const {error: deleteMealError} = await supabase
        .from('meal')
        .delete()
        .eq('meal_id',id);

        if(deleteMealError) {
            return {
                success: false,
                message: "Cannot delete meal"
            }
        }
        return {
            success: true,
            message: "Meal deleted successfully"
        }
    } catch (error:any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }    
}