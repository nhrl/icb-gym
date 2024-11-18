import supabase from "../../../database/db";

export async function addFavoriteTrainer(data: any) {
    try {
        const {userId, assignId, service_id} = data;

        const {error} = await supabase
        .from('favoritetrainer')
        .insert([
            {
                customer_id:userId,
                assign_id :assignId,
                service_id: service_id
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
            message: "Trainer Successfully added to favorites"
        }
    } catch (error: any) {
        return {
            success: false,
            message: "An unexpected error occurred. Please try again.",
            error: error.message,
        };
    }
}

export async function getFavoriteTrainer(customerId: any, assignId: any) {
    try {
        // Query the favoritetrainer table for a matching record
        const { data, error } = await supabase
            .from('favoritetrainer')
            .select('favorite_id') // Only need to select the primary key to check existence
            .match({ customer_id: customerId, assign_id: assignId})
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


export async function removeFavoriteTrainer(data: any) {
    try {
        const { userId, assignId ,service_id} = data;

        // Delete the entry matching both userId and dietplanId
        const { error } = await supabase
            .from('favoritetrainer')
            .delete()
            .match({ customer_id: userId, assign_id : assignId, service_id: service_id });

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

export async function showFavoriteTrainer(customerId: any, serviceId:any) {
    try {
        // Fetch all dietplan_id values from favoritedietplan table for the specified customer
        const { data: favoriteIds, error: favoriteError } = await supabase
        .from('favoritetrainer')
        .select('assign_id')
        .eq('customer_id', customerId)
        .eq('service_id',serviceId)

        if (favoriteError) {
            return {
                success: false,
                message: "Error fetching favorite Trainer IDs.",
                error: favoriteError.message,
            };
        }
        const assignIds = favoriteIds.map((item: any) => item.assign_id);

        if (assignIds.length === 0) {
            return {
              success: true,
              message: "No favorite Trainers found for this customer.",
              data: [],
            };
        }

        const { data: trainerData, error: trainerError } = await supabase
        .from('assign_trainer')
        .select(
          `
            assign_id,
            service_id,
            start_time,
            end_time,
            schedule,
            max_capacity,
            current_capacity,
            rate,
            description,
            trainer_id,
            trainer (
              trainer_id,
              firstname,
              lastname,
              email,
              specialty,
              trainer_img,
              availability
            ),
            service (
              service_name
            )
          `
        )
        .in('assign_id', assignIds);

        if(trainerError) {
            return {
                success: false,
                message: "Error fetching trainer details.",
                error: trainerError.message,
            };
        }

        const enrichedData = await Promise.all(
            trainerData.map(async (item) => {
              const { data: otherServices, error: serviceError } = await supabase
                .from("assign_trainer")
                .select(`
                  service (
                    service_name
                  )
                `)
                .eq("trainer_id", item.trainer_id);
      
              if (serviceError) {
                console.error(`Error fetching services for trainer ${item.trainer_id}:`, serviceError.message);
              }
      
              const serviceNames = otherServices?.map((item) => item.service);
            
              return {
                ...item,
                other_services: serviceNames,
              };
            })
        );

        return {
            success: true,
            message: "Successfully fetched favorite trainers",
            trainer: enrichedData,
        };
    } catch (error: any) {
        return {
            success: false,
            message: "An unexpected error occurred. Please try again.",
            error: error.message,
        };
    }
}