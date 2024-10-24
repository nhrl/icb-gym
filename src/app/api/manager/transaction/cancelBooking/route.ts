import { cancelBooking } from "@service/transaction/bookingTransaction";

export async function PUT(req: Request) {
    try {
        const data = await req.json();
        const message = await cancelBooking(data);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}