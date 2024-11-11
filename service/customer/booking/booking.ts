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

    // Filter out trainers who are fully booked on the client side
    const availableTrainers = data?.filter((trainer) => trainer.current_capacity < trainer.max_capacity) || [];

    return {
      success: true,
      message: "Assign trainer fetched successfully.",
      data: availableTrainers,
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
    const created_at = new Date().toISOString().split('T')[0]; // Get the current date (YYYY-MM-DD)

    //Fetch the assignment's start_time and end_time using assign_id
    const { data: assignment, error: assignmentError } = await supabase
      .from('assign_trainer')
      .select('start_time, end_time')
      .eq('assign_id', assign_id)
      .single();

    if (assignmentError) {
      return {
        success: false,
        message: "Error fetching assignment details.",
        error: assignmentError.message,
      };
    }

    const { start_time, end_time } = assignment;

    //Check if there is any active or pending booking for the same assign_id
    const { data: existingBooking, error: checkError } = await supabase
      .from('bookings')
      .select('booking_id, confirmation_status')
      .eq('customer_id', customer_id)
      .eq('assign_id', assign_id);

    if (checkError) {
      return {
        success: false,
        message: "Error checking existing bookings.",
        error: checkError.message,
      };
    }

    //If there is an existing active or pending booking, block the request
    const activeBooking = existingBooking.find(
      (booking) => booking.confirmation_status !== "Canceled"
    );

    if (activeBooking) {
      return {
        success: false,
        message: "You already have an active or pending booking for this service.",
      };
    }

    //If there is a canceled booking, reuse the entry and update its status and created_at
    const canceledBooking = existingBooking.find(
      (booking) => booking.confirmation_status === "Canceled"
    );

    if (canceledBooking) {
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          confirmation_status: confirmation_status,
          payment_status: payment_status,
          created_at: created_at, // Update the created_at column with the current date
        })
        .eq('booking_id', canceledBooking.booking_id);

      if (updateError) {
        return {
          success: false,
          message: "Failed to reuse canceled booking. Please try again.",
          error: updateError.message,
        };
      }
      // Increment capacity when reactivating the booking
      const { error: incrementError } = await supabase
      .rpc('increment_capacity', { assign_id_param: assign_id });

      if (incrementError) {
        return {
          success: false,
          message: "Booking reactivated, but failed to update trainer capacity.",
          error: incrementError.message,
        };
      }
      return { success: true, message: "Booking reactivated successfully." };
    }

    //Check for time conflicts with other active bookings of the user
    const { data: conflictingBookings, error: conflictError } = await supabase
      .from('bookings')
      .select('booking_id, assign_id')
      .eq('customer_id', customer_id)
      .neq('confirmation_status', 'Canceled'); // Ignore canceled bookings

    if (conflictError) {
      return {
        success: false,
        message: "Error checking for time conflicts.",
        error: conflictError.message,
      };
    }

    for (const booking of conflictingBookings) {
      const { data: conflictingAssignment, error: conflictingAssignmentError } = await supabase
        .from('assign_trainer')
        .select('start_time, end_time')
        .eq('assign_id', booking.assign_id)
        .single();

      if (conflictingAssignmentError) {
        return {
          success: false,
          message: "Error fetching conflicting assignment details.",
          error: conflictingAssignmentError.message,
        };
      }

      const existingStart = new Date(`1970-01-01T${conflictingAssignment.start_time}`);
      const existingEnd = new Date(`1970-01-01T${conflictingAssignment.end_time}`);
      const newStart = new Date(`1970-01-01T${start_time}`);
      const newEnd = new Date(`1970-01-01T${end_time}`);

      if (
        (newStart < existingEnd && newEnd > existingStart) ||
        (existingStart < newEnd && existingEnd > newStart)
      ) {
        return {
          success: false,
          message: "Time conflict with an existing booking.",
        };
      }
    }

    //Insert a new booking if no canceled booking is available to reuse
    const { error: bookingError } = await supabase
      .from('bookings')
      .insert([
        {
          customer_id: customer_id,
          trainer_id: trainer_id,
          assign_id: assign_id,
          payment_status: payment_status,
          confirmation_status: confirmation_status,
          created_at: created_at, // Set the current date for the new booking
        },
      ]);

    if (bookingError) {
      return {
        success: false,
        message: "Failed to add booking. Please try again.",
        error: bookingError.message,
      };
    }

    //Increment the current_capacity by 1 in assign_trainer
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

export async function getUserBookings(customer_id: any) {
  try {
    // Perform a join to fetch bookings and trainer information
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        booking_id, 
        customer_id, 
        assign_id, 
        payment_status, 
        confirmation_status, 
        created_at, 
        trainer_id,
        trainers:trainer_id (firstname, lastname)
      `) 
      .eq('customer_id',customer_id)// Join trainers table using trainer_id
    
    if (error) {
      return {
        success: false,
        message: 'Error fetching customer bookings.',
        error: error.message,
      };
    }

    // Transform data to return trainer's first and last name instead of trainer_id
    const transformedData = data.map((booking: any) => ({
      booking_id: booking.booking_id,
      customer_id: booking.customer_id,
      trainer_name: booking.trainers ? `${booking.trainers.firstname} ${booking.trainers.lastname}` : 'Trainer not found',
      assign_id: booking.assign_id,
      payment_status: booking.payment_status,
      confirmation_status: booking.confirmation_status,
      created_at: booking.created_at,
    }));

    return {
      success: true,
      message: 'Successfully fetched user bookings',
      data: transformedData,
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      error: error.message,
    };
  }
}
