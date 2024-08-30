import { getUser } from "@/../../service/getUser";
import { createSession, decrypt } from "@/app/_lib/session";

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

export async function POST(request: Request) {
   try {
    // Parse the request body to extract the ID
    const body = await request.json();
    //create session
    const session = await createSession(body);
    const decryptSession = await decrypt(session);
    return new Response(JSON.stringify(decryptSession), {
      status: 200,
    });
  } catch (error) {
    return new Response('Error parsing request body', {
      status: 400,
    });
  }
}