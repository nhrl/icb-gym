import supabase from "../../../database/db";

export async function addFavoriteDietPlan(data: any) {
    try {
        const {userId, dietplanId} = data;

        const {error} = await supabase
        .from('favoritedietplan')
        .insert([
            {
                customer_id:userId,
                dietplan_id:dietplanId
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

export async function getFavoriteDietplan(customerId: any, dietplanId: any) {
    try {
        // Query the favoritetrainer table for a matching record
        const { data, error } = await supabase
            .from('favoritedietplan')
            .select('favorite_id') // Only need to select the primary key to check existence
            .match({ customer_id: customerId, dietplan_id: dietplanId })
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


export async function removeFavoriteDietplan(data: any) {
    try {
        const { userId, dietplanId } = data;

        // Delete the entry matching both userId and dietplanId
        const { error } = await supabase
            .from('favoritedietplan')
            .delete()
            .match({ customer_id: userId, dietplan_id: dietplanId });

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

export async function showFavoritesDietplan(customerId: any) {
    try {
      // Fetch all dietplan_id values from favoritedietplan table for the specified customer
      const { data: favoriteIds, error: favoriteError } = await supabase
        .from('favoritedietplan')
        .select('dietplan_id')
        .eq('customer_id', customerId);
  
      if (favoriteError) {
        return {
          success: false,
          message: "Error fetching favorite diet plan IDs.",
          error: favoriteError.message,
        };
      }
  
      // Extract dietplan IDs
      const dietplanIds = favoriteIds.map((item: any) => item.dietplan_id);
  
      if (dietplanIds.length === 0) {
        return {
          success: true,
          message: "No favorite diet plans found for this customer.",
          data: [],
        };
      }
  
      // Fetch all data from dietplan table where dietplan_id is in the list of favorite IDs
      const { data: dietplans, error: dietplanError } = await supabase
        .from('dietplan')
        .select('*')
        .in('dietplan_id', dietplanIds);
  
      if (dietplanError) {
        return {
          success: false,
          message: "Error fetching favorite diet plans.",
          error: dietplanError.message,
        };
      }
  
      return {
        success: true,
        message: "Successfully fetched favorite diet plans",
        data: dietplans,
      };
    } catch (error: any) {
      return {
        success: false,
        message: "An unexpected error occurred. Please try again.",
        error: error.message,
      };
    }
  }
  