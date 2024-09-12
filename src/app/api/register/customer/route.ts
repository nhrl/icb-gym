import { registerCustomer, getCustomerData, updateCustomerData } from '../../../../../service/register/customer';


export async function POST(request: Request) {
    try {
        const data = await request.json();
        const message = await registerCustomer(data);
        return Response.json(message);

    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const message = await getCustomerData(id);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const data = await req.formData();
        const message = await updateCustomerData(data);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}