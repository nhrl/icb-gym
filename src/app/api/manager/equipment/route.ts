import { addEquipment, getEquipment, updateEquipment, deleteEquipment } from "@service/equipment/equipment";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const message = await addEquipment(data);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const message = await getEquipment();
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const data = await req.json();
        const message = await updateEquipment(data);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const data = await req.json();
        const message = await deleteEquipment(data);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}