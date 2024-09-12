import { addTrainer, getTrainer, deleteTrainer, updateTrainer} from "../../../../service/trainer/trainer";


export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const message = await addTrainer(formData);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const data = await getTrainer();
        return Response.json(data);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const formdata = await req.formData();
        const message = await updateTrainer(formdata);
        return Response.json(message);
    } catch (error) {
        return Response.json({error: "Error processign request"}, {status: 500});
    }
}

export async function DELETE(req : Request) {
    try {
        const data = await req.json();
        const {id} = data;
        const message = await deleteTrainer(id);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}