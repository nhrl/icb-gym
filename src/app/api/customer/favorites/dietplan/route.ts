import { addFavoriteDietPlan, removeFavoriteDietplan, getFavoriteDietplan} from "@service/customer/favorites/dietplan";

export async function POST(req : Request) {
    try {
        const data = await req.json();
        const message = await addFavoriteDietPlan(data);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const customerId = url.searchParams.get("customerId");
        const dietplanId = url.searchParams.get("dietplanId");
        const message = await getFavoriteDietplan(customerId,dietplanId);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const data = await req.json();
        const message = await removeFavoriteDietplan(data);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}