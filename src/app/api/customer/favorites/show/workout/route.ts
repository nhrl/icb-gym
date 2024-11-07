import { showFavoritesProgram } from "@service/customer/favorites/workout";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const customerId = url.searchParams.get("customerId");
        const message = await showFavoritesProgram(customerId);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}