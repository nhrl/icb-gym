import { getStreak } from "@service/customer/progress/streak";

export async function GET(req: Request){
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const message = await getStreak(id);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}