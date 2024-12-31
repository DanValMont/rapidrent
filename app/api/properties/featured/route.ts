import connectDB from '@/config/database';
import Property from '@/models/Property';
import { PropertyModelTypes } from '@/types/models-types';
import { isDynamicServerError } from "next/dist/client/components/hooks-server-context";

// export const dynamic = 'force-dynamic';

// GET /api/properties/featured
export const GET = async () => {
  try {
    await connectDB();

    const properties: PropertyModelTypes[] = await Property.find({
      is_featured: true,
    });
    
    return Response.json(properties);
  } catch (error) {
    if (isDynamicServerError(error)) {
      throw error;
    }
    console.log(error);
    return new Response('Something Went Wrong', { status: 500 });
  }
};