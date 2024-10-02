import { addExercises, getExercise, updateExercise, deleteExercise } from "@service/programs/exercise";

export async function POST(req: Request) {
    try {
      const formData = await req.formData();
  
      const exercises: any[] = [];
      
      // Convert formData.entries() into an array to avoid downlevel iteration issues
      const formEntries = Array.from(formData.entries());
      let currentExercise: any = {};
  
      // Iterate through the formEntries array
      for (const [key, value] of formEntries) {
        // Example key: exercises[0][name], value: 'Push-up'
        const match = key.match(/exercises\[(\d+)\]\[(\w+)\]/);
  
        if (match) {
          const index = parseInt(match[1], 10); // Get the exercise index
          const field = match[2]; // Get the field name (e.g., name, desc, etc.)
  
          if (!exercises[index]) {
            exercises[index] = {}; // Initialize if not exists
          }
  
          // Assign value to the correct field
          exercises[index][field] = value;
        }
      }
  
      // Convert any required fields to proper types
      exercises.forEach((exercise) => {
        exercise.reps = Number(exercise.reps);
        exercise.sets = Number(exercise.sets);
        exercise.program_id = Number(exercise.program_id);
      });
  
      const message = await addExercises(exercises); // Pass the constructed exercises array to the `addExercises` function
  
      return Response.json(message);
    } catch (error) {
      return Response.json({ error: "Error processing request" }, { status: 500 });
    }
  }
  

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const message = await getExercise(id);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const data = await req.formData();
        const message = await updateExercise(data);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const data = await req.formData();
        const message = await deleteExercise(data);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}