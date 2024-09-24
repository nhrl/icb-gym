import { addAssign, getAssign, removeAssign, updateAssign } from "@service/trainer/assignTrainer";

export async function POST(req : Request) {
    try {
        const data = await req.json();
        const message = await addAssign(data);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const message = await getAssign();
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 }); 
    }
}

export async function PUT(req : Request) {
    try {
        const data = await req.json()
        const message = await updateAssign(data);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 }); 
    }
}

export async function DELETE(req : Request) {
    try {
        const data = await req.json();
        const message = await removeAssign(data);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 }); 
    }
}