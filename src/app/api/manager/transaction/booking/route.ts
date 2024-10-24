import { getBookings, confirmBooking } from "@service/transaction/bookingTransaction";
export const dynamic = 'force-dynamic';
export async function GET() {
    try {
        const data = await getBookings();
        return Response.json(data);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}

export async function PUT(req : Request) {
    try {
        const data = await req.json();
        const message = await confirmBooking(data);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}