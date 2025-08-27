import CategoryForm from '@/components/admin/CategoryForm';
import React from 'react';

const CategoryManagement = () => {
    return (
        <div>
            <h1 className='text-2xl font-bold mb-2'>Category Management</h1>
            <hr />
            {/* // Category adding form */}
            <CategoryForm />
        </div>
    );
};

export default CategoryManagement;