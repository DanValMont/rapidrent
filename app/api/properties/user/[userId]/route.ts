import connectDB from "@/config/database";
import Property from "@/models/Property";
import { PropertyModelTypes } from "@/types/models-types";

// GET /api/properties/user/:userId
export const GET = async (
  request: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    await connectDB();

    const userId = params.userId;

    if (!userId) {
      return new Response("user ID is required", { status: 400 });
    }

    const properties: PropertyModelTypes[] = await Property.find({ owner: userId });
    return Response.json(properties);
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
