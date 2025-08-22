import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
    try {
        const { public_id } = await req.json();

        const result = await cloudinary.uploader.destroy(public_id);

        if (result.result === "ok") {
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: false, error: result }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}
