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

// delete multiple images
export async function DELETE(req: Request) {
    try {
        const { public_ids } = await req.json();

        const results = await Promise.all(
            public_ids.map((id: string) => cloudinary.uploader.destroy(id))
        );

        const failedDeletes = results.filter((result) => result.result !== "ok");

        if (failedDeletes.length === 0) {
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: false, errors: failedDeletes }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}
