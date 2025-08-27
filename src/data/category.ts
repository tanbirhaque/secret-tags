import { ICategories } from "@/types/CategoryType";

const Categories: ICategories[] = [
    {
        name: 'Clothing',
        slug: 'clothing',
        measurementSystem: 'CLOTHING_ALPHA',
        subCategories: [
            {
                name: 'Tops',
                slug: 'tops',
                measurementSystem: 'CLOTHING_ALPHA',
                subCategories: []
            },
            {
                name: 'Bottoms',
                slug: 'bottoms',
                measurementSystem: 'CLOTHING_ALPHA',
                subCategories: []
            }
        ]
    },
    {
        name: 'Footwear',
        slug: 'footwear',
        measurementSystem: 'CLOTHING_NUMERIC',
        subCategories: [
            {
                name: 'Sneakers',
                slug: 'sneakers',
                measurementSystem: 'CLOTHING_NUMERIC',
                subCategories: []
            },
            {
                name: 'Boots',
                slug: 'boots',
                measurementSystem: 'CLOTHING_NUMERIC',
                subCategories: []
            }
        ]
    },
    {
        name: 'Accessories',
        slug: 'accessories',
        measurementSystem: 'CUP_SIZE',
        subCategories: []
    }
];

export { Categories };