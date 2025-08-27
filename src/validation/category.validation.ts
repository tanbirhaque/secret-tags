import z from "zod";

// ✅ Category Schema
export const categorySchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    measurementSystem: z.array(z.string()).min(1, "At least one measurement system is required"),
    parentSlug: z.string().nullable(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
