import cloudinary from '@/lib/cloudinary';

export async function POST(req: Request) {
  try {
    // Step 1 — get file from formData
    const formData = await req.formData();

    // Step 2 — validate file exists
    const file = formData.get('file') as File;

    // Step 3 — validate file type
    if(!file){
        return Response.json(
            { error: 'No file uploaded' },
            { status: 400 }
        )
    }
    //
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if(!allowedTypes.includes(file.type)){
        return Response.json(
            { error: 'Invalid file type' },
            { status: 400 }
        )
    }

    // Step 4 — validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if(file.size > maxSize){
        return Response.json(
            { error: 'File size too large' },
            { status: 400 }
        )
    }

    // Step 5 — convert to base64
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');

    // Step 6 — upload to Cloudinary
    const result = await cloudinary.uploader.upload(`data:${file.type};base64,${base64}`);

    // Step 7 — return URL
    return Response.json(
      { url: result.secure_url },
      { status: 200 }
    );

  } catch (error) {
    console.error(error);
    return Response.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}