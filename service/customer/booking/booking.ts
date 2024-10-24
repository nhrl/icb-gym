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

export async function addBooking(data: any) {
  try {
    const { customer_id, trainer_id, assign_id } = data;
    const payment_status = "Unpaid";
    const confirmation_status = "Pending";

    // Insert new booking
    const { error: bookingError } = await supabase
      .from('bookings')
      .insert([
        {
          customer_id: customer_id,
          trainer_id: trainer_id,
          assign_id: assign_id,
          payment_status: payment_status,
          confirmation_status: confirmation_status,
        }
      ]);

    if (bookingError) {
      return {
        success: false,
        message: "Failed to add booking. Please try again.",
        error: bookingError.message,
      };
    }

    // Increment current_capacity by 1 in assign_trainer table
    const { error: capacityError } = await supabase
      .rpc('increment_capacity', { assign_id_param: assign_id });

    if (capacityError) {
      return {
        success: false,
        message: "Booking added, but failed to update trainer capacity.",
        error: capacityError.message,
      };
    }

    return { success: true, message: "New booking added successfully." };

  } catch (error: any) {
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
      error: error.message,
    };
  }
}

export async function getUserBookings(customer_id : any) {
  try {
    const {data, error} = await supabase
    .from('bookings')
    .select()
    .eq('customer_id',customer_id)

    if(error) {
      return {
        success: false,
        message: 'Error fetching customer bookings.',
        error: error.message,
      };
    }
    return {
      success :true,
      message: "Successfully fetch user bookings",
      data: data
    }
  } catch (error : any) {
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
      error: error.message,
    };
  }
}