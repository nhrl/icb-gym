import supabase from "../../database/db";

export async function addAssign(data: any) {
    try {
      const {
        service_id,
        trainer_id,
        time_start,
        time_end,
        schedule, // Schedule passed from the request
        max_capacity,
        rate,
        description,
      } = data;
  
      const current_capacity = 0;
  
      // Fetch all assignments for the same trainer from the database
      const { data: conflicts, error: conflictError } = await supabase
        .from("assign_trainer")
        .select("assign_id, start_time, end_time, schedule")
        .eq("trainer_id", trainer_id);
  
      if (conflictError) {
        return {
          success: false,
          message: "Failed to check for schedule conflicts. Please try again.",
          error: conflictError.message,
        };
      }
      
      // Check for conflicts with existing assignments
      const hasConflict = conflicts?.some((assignment) => {
        console.log("Checking conflicts for assignment:", assignment);
  
        // Ensure both schedules are arrays, parse if necessary
        const newSchedule = Array.isArray(schedule) ? schedule : JSON.parse(schedule);
        const existingSchedule = Array.isArray(assignment.schedule)
          ? assignment.schedule
          : JSON.parse(assignment.schedule);
  
        console.log("New Schedule:", newSchedule);
        console.log("Existing Schedule:", existingSchedule);
  
        // Check if there's at least one overlapping day between the two schedules
        const hasOverlappingDay = newSchedule.some((day: string) =>
          existingSchedule.includes(day)
        );
  
        console.log("Overlapping Days Found:", hasOverlappingDay);
  
        // If no overlapping days, skip the time check
        if (!hasOverlappingDay) {
          return false;
        }
  
        // Parse the time strings into Date objects for comparison
        const newStart = new Date(`1970-01-01T${time_start}`);
        const newEnd = new Date(`1970-01-01T${time_end}`);
        const existingStart = new Date(`1970-01-01T${assignment.start_time}`);
        const existingEnd = new Date(`1970-01-01T${assignment.end_time}`);
  
        console.log(
          `Checking time overlap: ${time_start} - ${time_end} vs ${assignment.start_time} - ${assignment.end_time}`
        );
  
        // Check if the time ranges overlap
        const timeOverlap =
          (newStart < existingEnd && newEnd > existingStart) ||
          (existingStart < newEnd && existingEnd > newStart);
  
        console.log("Time Overlap:", timeOverlap);
  
        // Return true if both day and time overlap
        return timeOverlap;
      });
  
      console.log("Conflict Found:", hasConflict);
  
      if (hasConflict) {
        return {
          success: false,
          message: "Trainer has a conflicting schedule. Please choose a different time or day.",
        };
      }
  
      // Insert the new assignment if no conflicts are found
      const { error } = await supabase.from("assign_trainer").insert([
        {
          service_id: service_id,
          trainer_id: trainer_id,
          description: description,
          start_time: time_start,
          end_time: time_end,
          schedule: schedule,
          max_capacity: max_capacity,
          current_capacity: current_capacity,
          rate: rate,
        },
      ]);
  
      if (error) {
        return {
          success: false,
          message: "Failed to assign trainer. Please try again.",
          error: error.message,
        };
      }
  
      return { success: true, message: "Trainer assigned successfully." };
    } catch (error: any) {
      console.error("Error occurred during assignment:", error);
      return {
        success: false,
        message: "An error occurred. Please try again.",
        error: error.message,
      };
    }
  }
  
  
export async function getAssign(id:any) {
    try {
        // Query the assign table, joining with trainer and service tables
        const { data, error } = await supabase
            .from('assign_trainer')
            .select()
            .eq('trainer_id',id);
        if (error) {
            return { success: false, message: "An error occurred while fetching the data.", error: error.message };
        }

        return { success: true, message: "Assign trainer fetch successfully", data};
    } catch (error:any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}

export async function updateAssign(data:any) {
    try {
        const {id, time_availability, schedule, max_capacity, current_capacity, rate} = data;

        //update assign data
        const updatedInfo = {
            time_availability,
            schedule,
            max_capacity,
            current_capacity,
            rate
        }

        const {error} = await supabase 
        .from('assign_trainer')
        .update(updatedInfo)
        .eq('assign_id',id)

        if(error) {
            return { success: false, message: 'Failed to update assign trainer info.', error: error.message };
        }
        return { success: true, message: "Assign trainer updated successfully"};
    } catch (error:any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}

export async function removeAssign(data:any) {
    try {
        const {assign_id} = data;
        const {error} = await supabase
        .from('assign_trainer')
        .delete()
        .eq('assign_id',assign_id);

        if(error) {
            return {
                success: false,
                message: "Failed to remove assign trainer. Please try again.",
                error: error.message
            };
        }
        return { success: true, message: "Assign trainer remove successfully"};
    } catch (error:any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}