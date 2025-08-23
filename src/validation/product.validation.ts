import { z } from "zod";

export const imageSchema = z.object({
    public_id: z.string().min(1),
    secure_url: z.url(),
    height: z.number().positive(),
    width: z.number().positive(),
    thumbnail: z.boolean(),
});

export const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    category: z.string().min(1, "Category is required"),
    stock: z.number().min(0, "Stock must be a valid non-negative number"),
    price: z.number().min(0, "Price must be a valid non-negative number"),
    discount: z.number().min(0).max(100, "Discount must be between 0 and 100"),
    listed: z.boolean(),
    tags: z.array(z.string()).default([]),
    features: z.array(z.string()).default([]),
    images: z.array(imageSchema),
    specifications: z.object({
        material: z.string().nullable(),
        height: z.number().nullable(),
        width: z.number().nullable(),
        weight: z.number().nullable(),
        color: z.string().nullable(),
    }),
});

export type ProductInput = z.infer<typeof productSchema>;
