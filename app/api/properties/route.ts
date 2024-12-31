import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import cloudinary from "@/config/cloudinary";
import { type NextRequest } from "next/server";
import { isDynamicServerError } from "next/dist/client/components/hooks-server-context";
// export const dynamic = "force-dynamic";

// GET /api/properties
export const GET = async (request: NextRequest) => {
    const searchParams = request.nextUrl.searchParams;
  try {
    await connectDB();
    const page = searchParams.get("page") || 1;
    const pageSize = searchParams.get("pageSize") || 6;

    const skip = (Number(page) - 1) * Number(pageSize);
    const total = await Property.countDocuments({});

    const properties = await Property.find({})
      .skip(skip)
      .limit(Number(pageSize));
    const result = {
      total,
      properties,
    };

    return Response.json(result);
  } catch (error) {
    if (isDynamicServerError(error)) {
      throw error;
    }
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// POST /api/properties

export const POST = async (request: Request) => {
  try {
    await connectDB();
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return new Response("User ID is required", { status: 401 });
    }

    const { userId } = sessionUser;
    const formData = await request.formData();

    // Access all values from amenities and images
    const amenities = formData.getAll("amenities");
    const images = formData.getAll("images").filter((image) => image !== "");

    // Create propertyData object for database
    const propertyData = {
      type: formData.get("type"),
      name: formData.get("name"),
      description: formData.get("description"),
      location: {
        street: formData.get("location.street"),
        city: formData.get("location.city"),
        state: formData.get("location.state"),
        zipcode: formData.get("location.zipcode"),
      },
      beds: formData.get("beds"),
      baths: formData.get("baths"),
      square_feet: formData.get("square_feet"),
      amenities,
      rates: {
        weekly: formData.get("rates.weekly"),
        monthly: formData.get("rates.monthly"),
        nightly: formData.get("rates.nightly"),
      },
      seller_info: {
        name: formData.get("seller_info.name"),
        email: formData.get("seller_info.email"),
        phone: formData.get("seller_info.phone"),
      },
      owner: userId,
      images,
    };

    // Upload image(s) to Cloudinary
    const imageUrls = [];

    for (const imageFile of images) {
      if (imageFile instanceof File) {
        const imageBuffer = await imageFile.arrayBuffer();
        const imageArray = Array.from(new Uint8Array(imageBuffer));
        const imageData = Buffer.from(imageArray);

        // Convert the image data to base64
        const imageBase64 = imageData.toString("base64");

        // Make request to upload to Cloudinary
        const result = await cloudinary.uploader.upload(
          `data:image/png;base64,${imageBase64}`,
          {
            folder: "rapidrent",
          }
        );

        imageUrls.push(result.secure_url);
      } else {
        console.error("Invalid image file", imageFile);
      }
    }

    propertyData.images = imageUrls;
    // propertyData = { ...propertyData, images: imageUrls };
    const newProperty = new Property(propertyData);
    await newProperty.save();

    return Response.redirect(
      `${process.env.NEXTAUTH_URL}/properties/${newProperty._id}`
    );
  } catch (error) {
    if (isDynamicServerError(error)) {
      throw error;
    }
    return new Response("Failed to add property", { status: 500 });
  }
};
