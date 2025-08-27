import { auth } from "@/config/auth";
import { prisma } from "@/prisma";
import { ExtendedError, handleError } from "@/utils/errorhandler";
import { RoleType } from "@prisma/client";
import { NextResponse } from "next/server";

// DELETE category
export async function DELETE(req: Request, { params }: { params: { categoryId: string } }) {
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

        const { categoryId } = params;

        const isCategoryExist = await prisma.category.findFirst({
            where: {
                id: categoryId
            }
        });

        if (!isCategoryExist) {
            throw new ExtendedError("Category doesn't exist", 404)
        }

        await prisma.category.delete({
            where: {
                id: categoryId
            }
        })

        return NextResponse.json(
            {
                success: true,
                message: "Category deleted successfully",
            },
            { status: 200 }
        )

    } catch (error) {
        handleError(error)
    }
}