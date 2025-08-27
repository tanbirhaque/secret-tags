import CategoryForm from '@/components/admin/CategoryForm';
import CategoryTable from '@/components/admin/CategoryTable';
import { prisma } from '@/prisma';
import React from 'react';

const CategoryManagement = async () => {

    const categories = await prisma.category.findMany({
        include: {
            children: true
        }
    });

    return (
        <div>
            <h1 className='text-2xl font-bold mb-2'>Category Management</h1>
            <hr />
            {/* // Category adding form */}
            <CategoryForm categories={categories} />
            <hr className='my-4' />
            <CategoryTable categories={categories} />
        </div>
    );
};

export default CategoryManagement;