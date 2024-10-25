import supabase from "../../database/db";

export async function getBookings() {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          booking_id ,
          customer_id,
          trainer_id ,
          assign_id ,
          payment_status,
          confirmation_status,
          created_at,
          customer (
            firstname,
            lastname
          )
        `);
  
      if (error) {
        return { 
          success: false, 
          message: 'Error fetching registered bookings.', 
          error: error.message 
        };
      }
  
      return { 
        success: true, 
        message: 'Bookings retrieved successfully.', 
        data 
      };
    } catch (error: any) {
      return { 
        success: false, 
        message: 'An error occurred. Please try again.', 
        error: error.message 
      };
    }
}

export async function confirmBooking(data: any) {
  try {
    const { ids } = data;
    const confirmation_status = "Confirmed";
    const payment_status = "Paid";

    // Fetch the current status of the bookings
    const { data: bookings, error: fetchError } = await supabase
      .from('bookings')
      .select('booking_id, confirmation_status')
      .in('booking_id', ids);

    if (fetchError) {
      return {
        success: false,
        message: "Failed to fetch bookings. Please try again.",
        error: fetchError.message,
      };
    }

    //Filter out bookings that are already canceled
    const validBookingIds = bookings
      ?.filter((booking) => booking.confirmation_status !== "Canceled")
      .map((booking) => booking.booking_id);

    if (validBookingIds.length === 0) {
      return {
        success: false,
        message: "No valid bookings to confirm.",
      };
    }

    // Update only the valid bookings
    const { data: updatedData, error: updateError } = await supabase
      .from('bookings')
      .update({
        confirmation_status: confirmation_status,
        payment_status: payment_status,
      })
      .in('booking_id', validBookingIds);

    if (updateError) {
      return {
        success: false,
        message: "Failed to confirm bookings. Please try again.",
        error: updateError.message,
      };
    }

    return {
      success: true,
      message: "Bookings confirmed successfully.",
      data: updatedData,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "An error occurred. Please try again.",
      error: error.message,
    };
  }
}

export async function cancelBooking(data: any) {
  try {
    const { ids } = data;
    const confirmation_status = "Canceled";

    // Fetch all the bookings that will be canceled to get their assign_ids
    const { data: bookingsToCancel, error: fetchError } = await supabase
      .from('bookings')
      .select('assign_id')
      .in('booking_id', ids);

    if (fetchError) {
      return {
        success: false,
        message: "Failed to fetch bookings for cancellation.",
        error: fetchError.message,
      };
    }

    // Update booking statuses to "Canceled"
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ confirmation_status: confirmation_status })
      .in('booking_id', ids);

    if (updateError) {
      return {
        success: false,
        message: "Failed to cancel bookings. Please try again.",
        error: updateError.message,
      };
    }

    // Call the decrement_capacity function for each assign_id
    for (const booking of bookingsToCancel) {
      const { assign_id } = booking;

      const { error: decrementError } = await supabase
        .rpc('decrement_capacity', { assign_id_param: assign_id });

      if (decrementError) {
        return {
          success: false,
          message: `Booking canceled, but failed to update capacity for assign_id: ${assign_id}.`,
          error: decrementError.message,
        };
      }
    }

    return { success: true, message: "Bookings canceled successfully." };
  } catch (error: any) {
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
      error: error.message,
    };
  }
}
