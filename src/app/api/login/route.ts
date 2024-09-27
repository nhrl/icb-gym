import { verifyUser } from "@service/auth/login/login";

export async function POST(request: Request) {
   try {
    const data = await request.json();
    const info = await verifyUser(data);
    return Response.json(info);
  } catch (error) {
    return new Response('Error parsing request body', {
      status: 400,
    });
  }
}