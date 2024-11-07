import { showFavoriteTrainer } from "@service/customer/favorites/trainer";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const customerId = url.searchParams.get("customerId");
        const serviceId = url.searchParams.get("serviceId");
        const message = await showFavoriteTrainer(customerId,serviceId);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}