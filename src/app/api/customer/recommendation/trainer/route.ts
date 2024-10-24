import { getTrainerRecommendation } from "@service/customer/recommendation/trainer";

export async function GET(req : Request) {
    try {
        const { searchParams } = new URL(req.url);
        const serviceID = searchParams.get('serviceId');
        const userID = searchParams.get('userId');
        const message = await getTrainerRecommendation(serviceID,userID);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}