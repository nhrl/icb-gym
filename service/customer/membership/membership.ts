import supabase from "../../../database/db";

export async function registerMembership(data : any) {
    try {
        const {membership_id, user_id} = data;
        const payment_status = "Unpaid";
        const status = "Pending";
        const created_at = new Date().toISOString();

        const {error} = await supabase
        .from('membership_registration')
        .insert([
            {
                customer_id: user_id,
                membership_id: membership_id,
                payment_status: payment_status,
                status: status,
                created_at: created_at
            }
        ])

        if(error) {
            return {
                success: false,
                message: "Failed to add membership. Please try again.",
                error: error.message
            };
        }
        return { success: true, message: "Membership registration added successfully"};
    } catch (error : any) {
        return { success: false, message: 'An unexpected error occurred.', error: error.message };
    }
}

export async function getMembership(customer_id: any) {
    try {
      const { data, error } = await supabase
        .from('membership_registration')
        .select('membership_id, status, date_start, date_end, payment_status, membership_rid')
        .eq('customer_id', customer_id)
        .order('membership_rid', { ascending: false }) // Get the latest membership first
        .limit(1); // Fetch only the latest entry
  
      if (error) {
        console.error('Error fetching membership:', error);
        return {
          success: false,
          message: 'Error fetching customer membership.',
          error: error.message,
        };
      }
  
      if (!data || data.length === 0) {
        return {
          success: false,
          message: 'No membership found for the given customer ID.',
        };
      }
  
      const latestMembership = data[0];
  
      // Check if the latest membership is still active or pending
      if (['Pending', 'Active'].includes(latestMembership.status)) {
        return {
          success: false,
          message: 'You already have an active or pending membership.',
          membership: latestMembership,
        };
      }
  
      return {
        success: true,
        message: 'No active or pending memberships. You can register a new membership.',
      };
    } catch (error: any) {
      console.error('Unexpected error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred.',
        error: error.message,
      };
    }
  }
  
