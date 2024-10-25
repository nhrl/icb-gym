import supabase from "../../../database/db";

export async function getProgramRecommendations(userId: any) {
    try {
      //Fetch customer fitness level and goals
      const { data: customerData, error: customerError } = await supabase
        .from('customer')
        .select('fitness_goals, fitness_level')
        .eq('customer_id', userId)
        .single();
  
      if (customerError) {
        return {
          success: false,
          message: 'Failed to fetch customer data.',
          error: customerError.message,
        };
      }
  
      if (!customerData) {
        return {
          success: false,
          message: 'No customer data found.',
        };
      }
  
      const { fitness_goals, fitness_level } = customerData;
  
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
      const { data: programs, error: programError } = await supabase
        .from('program')
        .select('*')
        .eq('fitness_level', fitness_level)
        .or(parsedGoals.map(goal => `fitness_goal.ilike.%${goal}%`).join(','));
  
      if (programError) {
        return {
          success: false,
          message: 'Failed to fetch programs.',
          error: programError.message,
        };
      }
  
      return {
        success: true,
        message: 'Programs fetched successfully.',
        programs: programs,
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'An unexpected error occurred.',
        error: error.message,
      };
    }
  }
  