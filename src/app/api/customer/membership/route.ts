import { registerMembership, getMembership } from "@service/customer/membership/membership";

export async function POST(req : Request) {
    try {
        const data = await req.json();
        const message = await registerMembership(data);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const message = await getMembership(id);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}