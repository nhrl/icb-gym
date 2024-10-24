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

export async function cancelBooking (data : any) {
  try {
    const {ids} = data;
    const confirmation_status = "Canceled";
    
    const { data: updatedData, error } = await supabase
    .from('bookings')
    .update({
      confirmation_status: confirmation_status,
    })
    .in("booking_id", ids); // Use 'in' to update multiple rows

    if (error) {
      return {
        success: false,
        message: "Failed to cancel bookings. Please try again.",
        error: error.message,
      };
    }
    return { success: true, message: "Bookings canceled successfully", data: updatedData };
  } catch (error : any) {
    return { 
      success: false, 
      message: 'An error occurred. Please try again.', 
      error: error.message 
    };
  }
}