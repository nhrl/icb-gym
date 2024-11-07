import { addFavoriteTrainer, getFavoriteTrainer, removeFavoriteTrainer } from "@service/customer/favorites/trainer";

export async function POST(req : Request) {
    try {
        const data = await req.json();
        const message = await addFavoriteTrainer(data);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const customerId = url.searchParams.get("customerId");
        const trainerId = url.searchParams.get("trainerId");
        const message = await getFavoriteTrainer(customerId,trainerId);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const data = await req.json();
        const message = await removeFavoriteTrainer(data);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}