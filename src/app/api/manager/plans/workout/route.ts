import { addProgram, getProgram, updateProgram, removePrograms} from "@service/programs/workout";

export async function POST(req: Request) {
    try {
        const data = await req.formData();
        const message = await addProgram(data);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const message = await getProgram();
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const data = await req.formData();
        const message = await updateProgram(data);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const data = await req.json();
        const message = await removePrograms(data);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}
