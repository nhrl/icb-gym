import { addMaintenance, getMaintenanceData} from "@service/equipment/maintenance";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const message = await addMaintenance(data);
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}


export async function GET() {
    try {
        const message = await getMaintenanceData();
        return Response.json(message);
    } catch (error) {
        return Response.json({ error: "Error processing request" }, { status: 500 });
    }
}