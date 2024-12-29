import connectDB from '@/config/database';
import Property from '@/models/Property';
import { PropertyModelTypes } from '@/types/models-types';

// GET /api/properties/featured
export const GET = async (request: Request) => {
  try {
    await connectDB();

    const properties: PropertyModelTypes[] = await Property.find({
      is_featured: true,
    });
    
    return Response.json(properties);
  } catch (error) {
    console.log(error);
    return new Response('Something Went Wrong', { status: 500 });
  }
};