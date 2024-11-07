import { addExercise, getExercise, updateExercise, deleteExercise } from "@service/programs/exercise";

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const message = await addExercise(data);
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