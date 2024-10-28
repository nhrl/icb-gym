import supabase from "../../../database/db";

export async function getDietplanRecommendations(userId : any) {
    try {
        //fetch user preference
        const {data, error} = await supabase
        .from('customer')
        .select('fitness_goals')
        .eq('customer_id',userId)
        .single()

        if (error) {
            return {
                success: false,
                message: 'Failed to fetch customer data.',
                error: error.message,
            };
        }

        if (!data) {
            return {
              success: false,
              message: 'No customer data found.',
            };
        }
        
        const {fitness_goals} = data;
        //Parse fitness goals into an array
        let parsedGoals: string[] = [];
        try {
            parsedGoals = Array.isArray(fitness_goals)
            ? fitness_goals
            : JSON.parse(fitness_goals);
        } catch (parseError: any) {
            return {
            success: false,
            message: 'Failed to parse fitness goals.',
            error: parseError.message,
            };
        }

        //Fetch programs matching fitness level and goals
        const { data: dietplan, error: dietplanError } = await supabase
        .from('dietplan')
        .select('*')
        .or(parsedGoals.map(goal => `fitness_goal.ilike.%${goal}%`).join(','));

        if (dietplanError) {
            return {
                success: false,
                message: 'Failed to fetch programs.',
                error: dietplanError.message,
            };
        }

        return {
            success: true,
            data: dietplan
        }
    } catch (error : any) {
        return {
            success: false,
            message: 'An unexpected error occurred.',
            error: error.message,
        };
    }
}