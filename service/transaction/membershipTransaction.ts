import supabase from "../../database/db";

export async function getRegisterMembership() {
    try {
      const { data, error } = await supabase
        .from('membership_registration')
        .select(`
          membership_rid,
          customer_id,
          membership_id,
          payment_status,
          status,
          date_start,
          date_end,
          created_at,
          customer (
            firstname,
            lastname
          )
        `);
  
      if (error) {
        return { 
          success: false, 
          message: 'Error fetching registered memberships.', 
          error: error.message 
        };
      }
  
      return { 
        success: true, 
        message: 'Registered memberships retrieved successfully.', 
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

export async function confirmMembership(data: any) {
    try {
        const { ids } = data;
        const payment_status = "Paid";
        const status = "Active";

        const { data: membershipData, error } = await supabase
        .from('membership_registration')
        .select('membership_rid, membership_id, status') // Include the status in the selection
        .in('membership_rid', ids);

        if (error || !membershipData) {
            return {
                success: false,
                message: "Error fetching membership data",
                error: error?.message || "No membership data found",
            };
        }

        // Filter out memberships that are not 'Pending'
        const pendingMemberships = membershipData.filter(
            (membership) => membership.status === "Pending"
        );

        if (pendingMemberships.length === 0) {
            return {
                success: false,
                message: "No pending memberships found for confirmation.",
            };
        }

        // Fetch corresponding membership plans
        const planIds = pendingMemberships.map((m) => m.membership_id);
        const { data: plans, error: planError } = await supabase
            .from('membership')
            .select('membership_id, validity_period')
            .in('membership_id', planIds);

        if (planError || !plans) {
            return {
                success: false,
                message: "Failed to retrieve membership plans.",
                error: planError?.message || "Membership plans not found.",
            };
        }

        // Create a map for quick lookup of membership validity
        const planMap = plans.reduce((acc: any, plan: any) => {
            const [amount, unit] = plan.validity_period.trim().split(/\s+/); // Trim and split by whitespace
            const normalizedUnit = unit.toLowerCase(); // Ensure consistent casing
        
            const totalMonths = normalizedUnit.includes('year')
                ? parseInt(amount) * 12 // Convert years to months
                : parseInt(amount); // Use months directly
        
            if (isNaN(totalMonths)) {
                console.error(`Invalid validity period for plan ${plan.membership_id}: ${plan.validity_period}`);
                acc[plan.membership_id] = 0; // Default to 0 if invalid
            } else {
                acc[plan.membership_id] = totalMonths;
            }
            return acc;
        }, {});

        // Prepare updates with calculated start and end dates
        const updates = membershipData.map((membership) => {
            const date_start = new Date(); // Current date
            const totalMonths = planMap[membership.membership_id] || 0;
            // Clone date and reliably add months
            const date_end = new Date(date_start);
            date_end.setMonth(date_end.getMonth() + totalMonths);

            // Adjust for month overflow (e.g., adding to end of month)
            if (date_end.getDate() !== date_start.getDate()) {
                date_end.setDate(0); // Set to the last day of the previous month
            }

            const formattedStartDate = date_start.toISOString().split('T')[0];
            const formattedEndDate = date_end.toISOString().split('T')[0];

            return {
                membership_rid: membership.membership_rid,
                payment_status,
                status,
                date_start: formattedStartDate,
                date_end: formattedEndDate,
            };
        });

       // Perform batch update using multiple individual updates
       const updatePromises = updates.map((update) =>
        supabase
            .from('membership_registration')
            .update({
                payment_status: update.payment_status,
                status: update.status,
                date_start: update.date_start,
                date_end: update.date_end,
            })
            .eq('membership_rid', update.membership_rid)
        );

        const results = await Promise.all(updatePromises);

        // Check if any of the updates failed
        const failedUpdates = results.filter(({ error }) => error);

        if (failedUpdates.length > 0) {
            return {
                success: false,
                message: "Some memberships could not be confirmed.",
                errors: failedUpdates.map(({ error }) => error?.message),
            };
        }

        return {
            success: true,
            message: "Memberships confirmed successfully.",
            data: updates,
        };
    } catch (error: any) {
        return { 
            success: false, 
            message: 'An error occurred. Please try again.', 
            error: error.message 
        };
    }
}

export async function cancelMembership(data: any) {
    try {
        const status = "Canceled";
        const { ids } = data; // Array of membership registration IDs to be updated

        // Perform the batch update
        const { error } = await supabase
            .from('membership_registration')
            .update({ status }) // Update status to "Canceled"
            .in('membership_rid', ids); // Match the IDs provided

        if (error) {
            return {
                success: false,
                message: "Failed to cancel memberships.",
                error: error.message,
            };
        }

        return {
            success: true,
            message: "Memberships canceled successfully.",
        };
    } catch (error: any) {
        return {
            success: false,
            message: 'An error occurred. Please try again.',
            error: error.message,
        };
    }
}