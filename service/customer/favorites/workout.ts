import supabase from "../../../database/db";

export async function addFavoriteWorkout(data: any) {
    try {
        const {userId, workoutId} = data;

        const {error} = await supabase
        .from('favoriteworkout')
        .insert([
            {
                customer_id:userId,
                program_id :workoutId
            }
        ])

        if(error) {
            return {
                success: false,
                message: "Failed to add to favorites",
                error: error.message
            }
        }
        return {
            success: true,
            message: "Dietplan Successfully added to favorites"
        }
    } catch (error: any) {
        return {
            success: false,
            message: "An unexpected error occurred. Please try again.",
            error: error.message,
        };
    }
}

export async function getFavoriteWorkout(customerId: any, workoutId: any) {
    try {
        // Query the favoritetrainer table for a matching record
        const { data, error } = await supabase
            .from('favoriteworkout')
            .select('favorite_id') // Only need to select the primary key to check existence
            .match({ customer_id: customerId, program_id: workoutId })
            .single(); // Use .single() to fetch a single matching row or null if none exists

        if (error && error.code !== 'PGRST116') { // Ignore 'row not found' error code
            return {
                success: false,
                message: "Error checking favorite status",
                error: error.message,
            };
        }

        // If data exists, the favorite item exists
        return {
            success: true,
            exists: !!data // true if data exists, false otherwise
        };

    } catch (error: any) {
        return {
            success: false,
            message: "An unexpected error occurred. Please try again.",
            error: error.message,
        };
    }
}


export async function removeFavoriteWorkout(data: any) {
    try {
        const { userId, workoutId } = data;

        // Delete the entry matching both userId and dietplanId
        const { error } = await supabase
            .from('favoriteworkout')
            .delete()
            .match({ customer_id: userId, program_id: workoutId });

        if (error) {
            return {
                success: false,
                message: "Failed to remove from favorites",
                error: error.message,
            };
        }

        return {
            success: true,
            message: "Successfully removed from favorites"
        };

    } catch (error: any) {
        return {
            success: false,
            message: "An unexpected error occurred. Please try again.",
            error: error.message,
        };
    }
}


export async function showFavoritesProgram(customerId:any) {
    try {
        const { data: favoriteIds, error: favoriteError } = await supabase
        .from('favoriteworkout')
        .select('program_id')
        .eq('customer_id', customerId);
  
      if (favoriteError) {
        return {
          success: false,
          message: "Error fetching favorite programs IDs.",
          error: favoriteError.message,
        };
      }

      const programIds = favoriteIds.map((item: any) => item.program_id);
      if (programIds.length === 0) {
        return {
          success: true,
          message: "No favorite programs found for this customer.",
          data: [],
        };
      }

      const { data: programs, error: programError } = await supabase
        .from('program')
        .select('*')
        .in('program_id', programIds);
  
      if (programError) {
        return {
          success: false,
          message: "Error fetching favorite programs.",
          error: programError.message,
        };
      }
  
      return {
        success: true,
        message: "Successfully fetched favorite programs",
        programs: programs,
      };
    } catch (error: any) {
        return {
            success: false,
            message: "An unexpected error occurred. Please try again.",
            error: error.message,
        };
    }
}