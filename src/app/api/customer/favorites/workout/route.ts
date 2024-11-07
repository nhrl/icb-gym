import { addFavoriteWorkout, getFavoriteWorkout, removeFavoriteWorkout } from "@service/customer/favorites/workout";

export async function POST(req : Request) {
    try {
        const data = await req.json();
        const message = await addFavoriteWorkout(data);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const customerId = url.searchParams.get("customerId");
        const workoutId = url.searchParams.get("workoutId");
        const message = await getFavoriteWorkout(customerId,workoutId);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const data = await req.json();
        const message = await removeFavoriteWorkout(data);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}