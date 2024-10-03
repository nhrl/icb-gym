import { addDietPlan, getDietPlan, updateDietPlan, removeDietPlan} from "@service/programs/dietplan";

export async function POST(req: Request) {
    try {
        const data = await req.formData();
        const message = await addDietPlan(data);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const message = await getDietPlan();
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}

export async function PUT(req :Request) {
    try {
        const data = await req.formData();
        const message = await updateDietPlan(data);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}

export async function DELETE(req :Request) {
    try {
        const data = await req.json();
        const message = await removeDietPlan(data);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}
