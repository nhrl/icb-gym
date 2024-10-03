import { resetPassword } from '@service/auth/login/resetPassword';


export async function PUT(request: Request) {
    try {
        const data = await request.json();
        const message = await resetPassword(data);
        return Response.json(message);      
    } catch (error) {
        return new Response('Error parsing request body', {
            status: 400,
        });
    }
   
}