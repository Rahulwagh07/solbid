import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import prisma from '@/lib/db';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  try {
    const userId = req.headers.get("userId");
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const formData = await req.formData();
    const username = formData.get('username') as string;
    const file = formData.get('file') as Blob;
     
    if(!file || !username){
      return NextResponse.json({ message: "Missing Required field" }, { status: 400 });
    }
    const url = await UploadImageToCloudinary(formData);
    const updateData: { imageUrl?: string; name?: string } = {};
    if (username) {
      updateData.name = username;
    }
    if(url){
      updateData.imageUrl = url;
    }
    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: updateData,
    });

    return NextResponse.json({ message: "Image uploaded successfully"}, { status: 200 });

  } catch (error) {
    console.error("Profile image upload error", error);
    return NextResponse.json({
      message: "Internal server error"
    }, { status: 500 });
  }
}

async function UploadImageToCloudinary(formData: FormData): Promise<string> {
  const file = formData.get('file') as Blob;

  if (!file) {
    throw new Error("Missing Required field");;
  }

  try {
    const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'Solbid', resource_type: 'image' },  
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );

      const reader = file.stream().getReader();
      const pump = () =>
        reader.read().then(({ done, value }) => {
          if (done) {
            uploadStream.end();
          } else {
            uploadStream.write(value);
            pump();
          }
        });

      pump();
    });
    
    return uploadResult.secure_url;

  } catch (error) {
    console.error("Image upload failed", error);
    throw new Error("Upload failed");
  }
}