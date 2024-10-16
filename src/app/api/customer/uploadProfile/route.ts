import { changeProfilePicture } from "@service/customer/updateDetails/updateDetails";

export async function PUT(req: Request) {
    try {
        const data = await req.formData();
        const message = await changeProfilePicture(data);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}