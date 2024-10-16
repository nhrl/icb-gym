import { getRegisterMembership, confirmMembership, cancelMembership} from "@service/transaction/membershipTransaction";
export const dynamic = 'force-dynamic';
export async function GET() {
    try {
        const data = await getRegisterMembership();
        return Response.json(data);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const data = await req.json();
        const message = await confirmMembership(data);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}
