import { getAssignTrainer } from "@service/customer/booking/booking";


export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const message = await getAssignTrainer(id);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 }); 
    }
}