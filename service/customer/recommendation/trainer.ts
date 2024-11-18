import supabase from "../../../database/db";

export async function getTrainerRecommendation(serviceId: any, userID: any) {
    try {

      // Fetch user time preference
      const { data: userData, error: userError } = await supabase
        .from('customer')
        .select('time_preference')
        .eq('customer_id', userID)
        .single(); // Ensure we're fetching a single user's data
  
      if (userError) {
        return {
          success: false,
          message: 'Error fetching user information',
          error: userError.message,
        };
      }
  
      const timePreference = userData?.time_preference;
      if (!timePreference) {
        return {
          success: false,
          message: 'User time preference not found',
        };
      }
  
      // Fetch trainer assignments for the specified service ID
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
        .eq('service_id', serviceId);
  
      if (trainerError) {
        return {
          success: false,
          message: 'Error fetching trainer information',
          error: trainerError.message,
        };
      }
  
      // Define time ranges for each preference
      const timeRanges: Record<string, [string, string]> = {
        Morning: ['05:00', '11:59'], // 5 AM to 11:59 AM
        Afternoon: ['12:00', '17:59'], // 12 PM to 5:59 PM
        Evening: ['18:00', '23:59'], // 6 PM to 11:59 PM
      };
  
      const [startRange, endRange] = timeRanges[timePreference] || [];
  
      // Filter trainers based on time preference
      const filteredTrainers = trainerData.filter((trainer: any) => {
        const startTime = new Date(`1970-01-01T${trainer.start_time}`);
        const endTime = new Date(`1970-01-01T${trainer.end_time}`);
  
        const preferenceStart = new Date(`1970-01-01T${startRange}`);
        const preferenceEnd = new Date(`1970-01-01T${endRange}`);
  
        return (
          (startTime >= preferenceStart && startTime <= preferenceEnd) ||
          (endTime >= preferenceStart && endTime <= preferenceEnd)
        );
      });
      
      // Fetch other assigned services for each trainer
    const enrichedData = await Promise.all(
      filteredTrainers.map(async (item) => {
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

      const availableTrainers = enrichedData?.filter((trainer) => trainer.current_capacity < trainer.max_capacity) || [];
      return {
        success: true,
        message: 'Successfully fetched trainer recommendations',
        trainer: availableTrainers,
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'An unexpected error occurred.',
        error: error.message,
      };
    }
  }
  