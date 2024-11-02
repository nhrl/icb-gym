import { custom } from "zod";
import supabase from "../../../database/db";
import { getFilePathFromUrl, removeImage, uploadImage } from "@service/imageUpload/imageUploader";

const folder = 'progress';
export async function addProgress(data: any) {
    try {
        const customer_id = Number(data.get('userID'));
        const week_number = Number(data.get('week'));
        const description = data.get('desc') as string;
        const weight = Number(data.get('weight'));
        const workout_count = Number(data.get('workout_count'));
        const bodyfat_percentage = Number(data.get('bodyfat_percentage'));
        const image = data.get('photo') as File;

        let imageUrl: string | null = null;
        if (image) {
            imageUrl = await uploadImage(image, folder);
        }

        // Add progress to ProgressTable
        const { error: progressError } = await supabase
            .from('progresstable')
            .insert([
                {
                    customer_id: customer_id,
                    week_number: week_number,
                    description: description,
                    weight: weight,
                    workout_count: workout_count,
                    bodyfat_percentage: bodyfat_percentage,
                    photo: imageUrl
                }
            ]);

        if (progressError) {
            return {
                success: false,
                message: "Failed to add new progress.",
                error: progressError.message
            };
        }

        // Check if a streak record exists for the customer
        const { data: streakData } = await supabase
            .from('gymstreaktable')
            .select('*')
            .eq('customer_id', customer_id)
            .single();

        if (!streakData) {
            // No streak exists, so create a new one
            const { error: insertError } = await supabase
                .from('gymstreaktable')
                .insert([
                    {
                        customer_id: customer_id,
                        current_gymstreak: 1,
                        best_gymstreak: 1,
                        expire_date: new Date(new Date().setDate(new Date().getDate() + 7)) // Set expire_date one week from now
                    }
                ]);

            if (insertError) {
                return {
                    success: false,
                    message: "Failed to create initial gym streak.",
                    error: insertError.message
                };
            }

            return { success: true, message: "New progress and initial gym streak created successfully" };
        } else  {
             // Increment the current streak if it exists
            const newCurrentStreak = streakData.current_gymstreak + 1;
            
            // Only update best streak if current streak surpasses it
            const newBestStreak = newCurrentStreak > streakData.best_gymstreak
                ? newCurrentStreak
                : streakData.best_gymstreak;

            const { error: updateError } = await supabase
                .from('gymstreaktable')
                .update({
                    current_gymstreak: newCurrentStreak,
                    best_gymstreak: newBestStreak,
                    expire_date: new Date(new Date().setDate(new Date().getDate() + 7)) // Update expire_date to one week from now
                })
                .eq('customer_id', customer_id);

            if (updateError) {
                return {
                    success: false,
                    message: "Failed to update gym streak.",
                    error: updateError.message
                };
            }
        }
        return { success: true, message: "New progress and gym streak updated successfully" };
    } catch (error: any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}


export async function getProgress(id: any) {
    try {
        const {data, error} = await supabase
        .from('progresstable')
        .select()
        .eq('customer_id',id);

        if(error) {
            return {
                success: false,
                message: "Failed to fetch user progress.",
                error: error.message
            }
        }

        return {
            success: true,
            message: "Successfully fetch user progress",
            data: data
        }
    } catch (error : any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}

export async function deleteProgress(info: any) {
    try {
        const { progress_id } = info;

        // Fetch progress data for the specified ID
        const { data, error } = await supabase
            .from('progresstable')
            .select('progress_id, photo')
            .eq('progress_id', progress_id)
            .single(); // Fetch a single record

        if (error) {
            return {
                success: false,
                message: "Error getting progress data",
                error: error.message
            };
        }

        if (!data) {
            return {
                success: false,
                message: "No progress entry found with the given ID"
            };
        }

        // Delete associated image if it exists
        const path = data.photo;
        if (path && path.trim() !== "") {
            // Only proceed if photo is not empty or null
            const fileName = getFilePathFromUrl(path); // Extract the file name from the URL
            const imageRemovalResult = await removeImage(fileName);
            if (!imageRemovalResult.success) {
                return {
                    success: false,
                    message: `Error removing image ${fileName} from storage`
                };
            }
        } else {
            console.log(`No image found for progress with ID: ${progress_id}, skipping image deletion...`);
        }

        // Now delete the progress record from the database
        const { error: deleteProgressError } = await supabase
            .from('progresstable')
            .delete()
            .eq('progress_id', progress_id);

        if (deleteProgressError) {
            return {
                success: false,
                message: 'Error deleting the progress data',
                error: deleteProgressError.message
            };
        }

        return { success: true, message: 'Progress and associated image removed successfully' };
    } catch (error: any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}

export async function getTotalWorkout(id: any) {
    try {
      const { data, error } = await supabase
        .from('progresstable')
        .select('workout_count, date_added')
        .eq('customer_id', id);
  
      if (error) {
        return {
          success: false,
          message: "Failed to fetch progress data",
          error: error.message
        };
      }
  
      // Initialize a map to hold workout totals for each month
      const monthlyWorkouts = Array.from({ length: 12 }, () => 0);
  
      // Aggregate workout counts per month
      data.forEach((entry: { workout_count: number; date_added: string }) => {
        const month = new Date(entry.date_added).getMonth(); // 0 for January, 1 for February, etc.
        monthlyWorkouts[month] += entry.workout_count;
      });
  
      // Format data as required by chartData
      const chartData = [
        { month: "January", workouts: monthlyWorkouts[0] },
        { month: "February", workouts: monthlyWorkouts[1] },
        { month: "March", workouts: monthlyWorkouts[2] },
        { month: "April", workouts: monthlyWorkouts[3] },
        { month: "May", workouts: monthlyWorkouts[4] },
        { month: "June", workouts: monthlyWorkouts[5] },
        { month: "July", workouts: monthlyWorkouts[6] },
        { month: "August", workouts: monthlyWorkouts[7] },
        { month: "September", workouts: monthlyWorkouts[8] },
        { month: "October", workouts: monthlyWorkouts[9] },
        { month: "November", workouts: monthlyWorkouts[10] },
        { month: "December", workouts: monthlyWorkouts[11] },
      ];
  
      return {
        success: true,
        message: "Successfully fetched user progress",
        data: chartData
      };
    } catch (error: any) {
      return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}
  

export async function setTargetWeight(data: any) {
    try {
        const {customer_id,target_weight} = data;
        
        const {error} = await supabase
        .from('targetweight')
        .insert([
            {
                customer_id: customer_id,
                target_weight: target_weight
            }
        ]);

        if(error) {
            return {
                success: false,
                message: "Failed to set your target weight"
            }
        }
        return {
            success: true,
            message: "Your target body weight successfully added"
        }
    } catch (error: any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}

export async function getTargetWeight(id: any) {
    try {
        const {data, error} = await supabase
        .from('targetweight')
        .select()
        .eq('customer_id',id)
        .single()

        if(error) {
            return {
                success:false,
                message:"Failed to fetch target weight"
            }
        }
        return {
            success: true,
            message: "Successfully fetch your target weight",
            data: data
        }
    } catch (error: any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}

export async function removeTargetWeight(id: any) {
    try {
        const {error} = await supabase
        .from('targetweight')
        .delete()
        .eq('customer_id',id);

        if(error) {
            return {
                success: false,
                message: "Failed to remove target weight",
                error: error.message
            }
        }

        return {
            success: true,
            message: "Your target weight has been successfully remove"
        }
    } catch (error: any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}