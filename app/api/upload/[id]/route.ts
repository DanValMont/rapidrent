import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getSessionUser } from '@/utils/getSessionUser';
import Property from '@/models/Property';
import connectDB from '@/config/database';


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request, { params }: { params: { id: string } }) {
  // const session = await getServerSession(authOptions)
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const existingUrl = formData.get('existingUrl') as string;

    // Get session user
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Get property from database
    const property = await Property.findById(params.id);
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // If there's an existing URL but it's different, delete it from Cloudinary
    if (existingUrl) {
      const publicId = existingUrl.split('/').pop()?.split('.')[0];
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(`rapidrent/${publicId}`);
        } catch (error) {
          console.error('Error deleting image from Cloudinary:', error);
        }
      }
    }

    // If no new file is provided, return after deleting the old image
    if (!file) {
      return NextResponse.json(
        { message: 'Image deleted successfully' },
        { status: 200 }
      );
    }

    // Convert the file to a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload new image to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'rapidrent',
          },
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        )
        .end(buffer);
    });

    // Return the new image URL
    return NextResponse.json(uploadResponse);
  } catch (error) {
    console.error('Error in upload:', error);
    return NextResponse.json(
      { error: 'Error uploading image' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // Get session user
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();
    const imageUrl = await request.json();
    const publicId = imageUrl.split('/').pop()?.split('.')[0];
    await cloudinary.uploader.destroy(`rapidrent/${publicId}`);
    return Response.json('Image deleted successfully');
  } catch (error) {
    console.error('Error deleting image:', error);
    return new Response('Error deleting image', { status: 500 });
  }
}