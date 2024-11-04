import { sendEmail } from "@service/auth/verification/verify";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const response = await sendEmail(data);
        return new Response(JSON.stringify(response), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: any) {
        return new Response(
            JSON.stringify({ error: "Error processing request", error1: error.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
