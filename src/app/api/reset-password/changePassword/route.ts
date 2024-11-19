import { changePassword } from "@service/forgot-password/changePassword";

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const message = await changePassword(data);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}