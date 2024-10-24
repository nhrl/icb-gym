import { addBooking, getUserBookings } from "@service/customer/booking/booking";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const message = await addBooking(data);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const message = await getUserBookings(id);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}