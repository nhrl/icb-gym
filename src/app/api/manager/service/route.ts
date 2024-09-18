import { addService, getService, deleteService, updateService} from "@service/service/service";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const message = await addService(formData);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const data = await getService();
        return Response.json(data);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const formData = await req.formData();
        const message = await updateService(formData);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error Updating service" }, { status: 500 });
    }
}


export async function DELETE(req: Request) {
    try {
        const data = await req.json();
        const {id} = data;
        const message = await deleteService(id);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error deleting service" }, { status: 500 });
    }
}