import { addMeal, getMeal, updateMeal, removeMeal } from "@service/programs/meals";

export async function POST(req: Request) {
    try {
      const formData = await req.formData();
  
      const meals: any[] = [];
  
      // Convert formData.entries() into an array to avoid downlevel iteration issues
      const formEntries = Array.from(formData.entries());
      let currentMeal: any = {};
  
      // Iterate through the formEntries array
      for (const [key, value] of formEntries) {
        // Example key: meals[0][meal], value: 'Breakfast'
        const match = key.match(/meals\[(\d+)\]\[(\w+)\]/);
  
        if (match) {
          const index = parseInt(match[1], 10); // Get the meal index
          const field = match[2]; // Get the field name (e.g., meal, food, desc, etc.)
  
          if (!meals[index]) {
            meals[index] = {}; // Initialize if not exists
          }
  
          // Assign value to the correct field
          meals[index][field] = value;
        }
      }
  
      // Convert any required fields to proper types
      meals.forEach((meal) => {
        meal.dietplan_id = Number(meal.dietplan_id);
        meal.protein = Number(meal.protein);
        meal.carbohydrates = Number(meal.carbohydrates);
        meal.fats = Number(meal.fats);
        meal.calories = Number(meal.calories);
      });
  
      const message = await addMeal(meals); // Pass the constructed meals array to the `addMeal` function
  
      return Response.json(message);
    } catch (error) {
      return Response.json({ error: "Error processing request" }, { status: 500 });
    }
  }
  

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const message = await getMeal(id);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const data = await req.formData();
        const message = await updateMeal(data);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const data = await req.formData();
        const message = await removeMeal(data);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}