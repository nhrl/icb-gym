import { getUser } from "../../../../service/getUser";

export async function GET(request: Request) {
    try {
        const data = await getUser();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        let errorMessage = "An unknown error occurred";

        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
    }
}