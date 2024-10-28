import { getDietplanRecommendations } from "@service/customer/recommendation/dietplan";

export async function GET(req : Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userID = searchParams.get('userId');
        const message = await getDietplanRecommendations(userID);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}