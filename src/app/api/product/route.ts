// src/app/api/products/route.ts

import { auth } from "@/config/auth";
import { prisma } from "@/prisma";
import { ExtendedError, handleError } from "@/utils/errorhandler";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            throw new ExtendedError("Unauthorized", 401);
        }

        const formData = await req.formData();

        const name = formData.get("name")?.toString().trim();
        if (!name) throw new ExtendedError("Name is required", 400);

        const description = formData.get("description")?.toString().trim();
        if (!description) throw new ExtendedError("Description is required", 400);

        const category = formData.get("category")?.toString().trim();
        if (!category) throw new ExtendedError("Category is required", 400);

        // ✅ Parse numbers properly
        const stock = Number(formData.get("stock"));
        if (isNaN(stock) || stock < 0) {
            throw new ExtendedError("Stock must be a valid non-negative number", 400);
        }

        const price = Number(formData.get("price"));
        if (isNaN(price) || price < 0) {
            throw new ExtendedError("Price must be a valid non-negative number", 400);
        }

        const discount = Number(formData.get("discount"));
        if (isNaN(discount) || discount < 0 || discount > 100) {
            throw new ExtendedError("Discount must be a valid number between 0 and 100", 400);
        }

        const listed = formData.get("listed") === "true";

        // ✅ Parse images (sent as JSON strings from frontend)
        const imagesData = formData.getAll("images") as string[];
        const images = imagesData.map((img) => JSON.parse(img)) as {
            public_id: string;
            secure_url: string;
            height: number;
            width: number;
            thumbnail: boolean;
        }[];

        // ✅ Parse tags & features as strings
        const tags = formData.getAll("tags").map((t) => t.toString());
        const features = formData.getAll("features").map((f) => f.toString());

        // ✅ Parse specifications (convert numbers where needed)
        const specifications = {
            material: formData.get("material")?.toString() || null,
            height: formData.get("height") ? Number(formData.get("height")) : null,
            width: formData.get("width") ? Number(formData.get("width")) : null,
            weight: formData.get("weight") ? Number(formData.get("weight")) : null,
            color: formData.get("color")?.toString() || null,
        };

        const productData: Prisma.ProductCreateInput = {
            name,
            description,
            category,
            stock,
            price,
            discount,
            listed,
            tags,
            features,
            images, // already parsed
            specifications, // if this is a nested model, change accordingly
        };

        // ✅ Save to DB
        const newProduct = await prisma.product.create({
            data: productData,
        });

        return NextResponse.json(
            { message: "Product created successfully", product: newProduct },
            { status: 201 }
        );

    } catch (error) {
        return handleError(error);
    }
}
