import { auth } from "@/config/auth";
import { prisma } from "@/prisma";
import { ExtendedError, handleError } from "@/utils/errorhandler";
import { NextResponse } from "next/server";
import { CategoryInput, categorySchema } from "@/validation/category.validation";
import { RoleType } from "@prisma/client";

export async function POST(req: Request) {
    try {
        const session = await auth();
        const userId = session?.user?.id;
        const userRole = session?.user?.role;

        if (!userId) {
            throw new ExtendedError("Unauthorized", 401);
        }

        if (userRole !== RoleType.ADMIN) {
            throw new ExtendedError("Forbidden", 403);
        }

        const formData = await req.formData();

        // ✅ Build raw object
        const name = formData.get("name")?.toString() ?? "";
        const slug = name.toLowerCase().replace(/\s+/g, "-");
        const measurementSystem = formData.getAll("measurementSystem").map((m) => m.toString());
        const parentSlug = formData.get("parent")?.toString() || null;

        const rawData: CategoryInput = {
            name,
            slug,
            measurementSystem,
            parentSlug,
        };

        // ✅ Validate with Zod
        const categoryData = categorySchema.parse(rawData);

        // ✅ Check for existing category
        const existingCategory = await prisma.category.findUnique({
            where: { slug },
        });

        if (existingCategory) {
            throw new ExtendedError("Category with this name already exists", 409);
        }

        // ✅ Save to DB
        const newCategory = await prisma.category.create({
            data: categoryData,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Category created successfully",
                category: newCategory,
            },
            { status: 201 }
        );
    } catch (error) {
        return handleError(error);
    }
}

// get categories
export async function GET() {
    try {
        const session = await auth();
        const userId = session?.user?.id;
        const userRole = session?.user?.role;

        if (!userId) {
            throw new ExtendedError("Unauthorized", 401);
        }

        if (userRole !== RoleType.ADMIN) {
            throw new ExtendedError("Forbidden", 403);
        }

        const categories = await prisma.category.findMany();

        return NextResponse.json(
            {
                success: true,
                categories,
            },
            { status: 200 }
        );
    } catch (error) {
        return handleError(error);
    }
}
