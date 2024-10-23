import supabase from "../../../database/db";

export async function getAssignTrainer(serviceId: any) {
    try {
      const { data, error } = await supabase
        .from("assign_trainer")
        .select(`
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
          service(
            service_name
          )
        `)
        .eq("service_id", serviceId);
  
      if (error) {
        return {
          success: false,
          message: "An error occurred while fetching the data.",
          error: error.message,
        };
      }
  
      return {
        success: true,
        message: "Assign trainer fetched successfully.",
        data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: "An error occurred. Please try again.",
        error: error.message,
      };
    }
}