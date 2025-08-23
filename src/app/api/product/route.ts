import { auth } from "@/config/auth";
import { prisma } from "@/prisma";
import { ExtendedError, handleError } from "@/utils/errorhandler";
import { ProductInput, productSchema } from "@/validation/product.validation";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            throw new ExtendedError("Unauthorized", 401);
        }

        const formData = await req.formData();

        const rawImages = formData.get("images") as string;
        const images = JSON.parse(rawImages);

        // ✅ Build raw object first
        const rawData: Partial<ProductInput> = {
            name: formData.get("name")?.toString(),
            description: formData.get("description")?.toString(),
            category: formData.get("category")?.toString(),
            stock: Number(formData.get("stock")),
            price: Number(formData.get("price")),
            discount: Number(formData.get("discount")),
            listed: formData.get("listed") === "true",
            images,
            tags: formData.getAll("tags").map((t) => t.toString()),
            features: formData.getAll("features").map((f) => f.toString()),
            specifications: {
                material: formData.get("material")?.toString() || null,
                height: formData.get("height") ? Number(formData.get("height")) : null,
                width: formData.get("width") ? Number(formData.get("width")) : null,
                weight: formData.get("weight") ? Number(formData.get("weight")) : null,
                color: formData.get("color")?.toString() || null,
            },
        };

        // console.log("Raw data:", rawData.images);

        // ✅ Validate with Zod
        const productData = productSchema.parse(rawData);

        // ✅ Save to DB
        const newProduct = await prisma.product.create({
            data: productData,
        });

        return NextResponse.json(
            {
                message: "Product created successfully",
                product: newProduct
            },
            { status: 201 }
        );

    } catch (error) {
        return handleError(error);
    }
}
