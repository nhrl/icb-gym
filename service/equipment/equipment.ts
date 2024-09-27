import supabase from "../../database/db";

export async function addEquipment(data:any) {
    try {
        const {name, quantity, purchase_date } = data;
        //insert equipment data
        const {data:equipment ,error} = await supabase
        .from('equipment')
        .insert([
            {
                name: name,
                quantity: quantity,
                purchase_date: purchase_date
            }
        ]).select();

        if(error) {
            return {
                success: false,
                message: "Failed to add equipment. Please try again.",
                error: error.message
            };
        }
        return { success: true, message: "New Equipment added successfully", data: equipment};
    } catch (error: any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}

export async function getEquipment() {
    try {
      // Fetch equipment along with its latest maintenance date
      const { data, error } = await supabase
        .from('equipment')
        .select(`
          *,
          maintenance (
            maintenance_date
          )
        `)
        .order('maintenance_date', { foreignTable: 'maintenance', ascending: false });
  
      if (error) {
        return {
          success: false,
          message: 'An error occurred while fetching the data.',
          error: error.message,
        };
      }
  
      // Transform the data to extract the latest maintenance date
      const transformedData = data.map((equipment) => {
        // Check if there are any maintenance records
        const latestMaintenanceDate = equipment.maintenance?.[0]?.maintenance_date || null;
  
        // Return equipment data with the latest maintenance date as a string
        return {
          equipment_id: equipment.equipment_id,
          name: equipment.name,
          quantity: equipment.quantity,
          purchase_date: equipment.purchase_date,
          maintenance_date: latestMaintenanceDate, // Returns the latest date or null if no maintenance records
        };
      });
  
      return {
        success: true,
        message: 'Equipment and latest maintenance fetched successfully',
        data: transformedData,
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'An error occurred. Please try again.',
        error: error.message,
      };
    }
  }
  
  

export async function updateEquipment(data:any) {
    try {
        const {id, name, quantity, purchase_date } = data;

        const equipmentInfo = {
            name,
            quantity,
            purchase_date
        }

        //update equipment
        const {error} = await supabase
        .from('equipment')
        .update(equipmentInfo)
        .eq('equipment_id', id)

        if(error) {
            return { success: false, message: 'Failed to update equipment info.', error: error.message };
        }
        return { success: true, message: "Equipment updated successfully"};
    } catch (error: any) {
        return { success: false, message: "An error occurred. Please try again.", error: error.message };
    }
}

export async function deleteEquipment(data: any) {
  try {
      const { ids } = data; // Expect an array of equipment IDs

      // Remove multiple equipment items using the `in` method for array of ids
      const { error } = await supabase
          .from('equipment')
          .delete()
          .in('equipment_id', ids); // Use `.in()` to delete multiple equipment

      if (error) {
          return {
              success: false,
              message: "Failed to remove equipment. Please try again.",
              error: error.message
          };
      }
      
      return { success: true, message: "Equipment removed successfully" };
  } catch (error: any) {
      return { success: false, message: "An error occurred. Please try again.", error: error.message };
  }
}
