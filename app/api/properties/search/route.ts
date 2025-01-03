import connectDB from "@/config/database";
import Property from "@/models/Property";

export const dynamic = 'force-dynamic';

// GET /api/properties/search
export const GET = async (request: Request) => {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location");
    const propertyType = searchParams.get("propertyType");

    const locationPattern = new RegExp(location ?? "", "i");

    // Match location pattern against database fields
    let query: {
      $or: (
        | { name: RegExp }
        | { description?: RegExp }
        | { "location.street"?: RegExp }
        | { "location.city"?: RegExp }
        | { "location.state"?: RegExp }
        | { "location.zipcode"?: RegExp }
      )[];
      type?: RegExp;
    } = {
      $or: [
        { name: locationPattern },
        { description: locationPattern },
        { "location.street": locationPattern },
        { "location.city": locationPattern },
        { "location.state": locationPattern },
        { "location.zipcode": locationPattern },
      ],
    };

    // Only check for property if its not 'All'
    if (propertyType && propertyType !== "All") {
      const typePattern = new RegExp(propertyType, "i");
      query.type = typePattern;
    }

    const properties = await Property.find(query);

    return Response.json(properties);
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
