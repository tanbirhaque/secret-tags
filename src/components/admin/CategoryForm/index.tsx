"use client";

import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { measurementSystemOptions } from '@/utils/categoryUtils';
import { toastOptions } from '@/utils/toastOptions';
import { useEffect, useState, useTransition } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';

const CategoryForm = () => {
    const [isPending, startTransition] = useTransition();
    const [parentOptions, setParentOptions] = useState([]);
    const [selectedMeasurementSystem, setSelectedMeasurementSystem] = useState<{ value: string; label: string }[]>([]);
    const [selectedParent, setSelectedParent] = useState<{ value: string; label: string } | null>(null);

    // Fetch categories for parent category selection if needed
    const fetchCategories = async () => {
        const res = await fetch('/api/categories');
        if (!res.ok) {
            console.error("Failed to fetch categories:", res.statusText);
            return;
        }
        const data = await res.json();
        console.log("Fetched categories:", data);
        // Map categories to select options
        const options = data.categories.map((cat: any) => ({
            value: cat.slug,
            label: cat.name,
        }));
        setParentOptions(options);
    };
    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (formData: FormData) => {
        startTransition(async () => {
            const parentSlug = selectedParent?.value
            formData.append('parentSlug', parentSlug as string)
            // Submit the form data
            const res = await fetch('/api/categories', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                console.error("Failed to create category:", res.statusText);
                toast.error("Failed to create category.", toastOptions);
                return;
            } else {
                toast.success("Category created successfully.", toastOptions);
                await fetchCategories(); // Refresh parent categories
                formData.delete('name');
                setSelectedMeasurementSystem([]);
                setSelectedParent(null);
            }
        });
    }

    return (
        <form className="space-y-4" onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleSubmit(formData);
        }}>
            <label htmlFor="name" className='text-sm'>Category Name</label>
            <Input
                id='name'
                name='name'
                placeholder='Enter category name'
                required
            />

            <label htmlFor="measurementSystem" className='text-sm'>Measurement System</label>
            {/* have to reset after form submission */}
            <Select
                name='measurementSystem'
                value={selectedMeasurementSystem}
                onChange={(selected) => setSelectedMeasurementSystem(selected as { value: string; label: string }[])}
                options={measurementSystemOptions}
                isClearable
                isMulti
            />

            <label htmlFor='parent' className='text-sm'>Parent Category</label>
            <Select
                name='parent'
                value={selectedParent}
                onChange={(selected) => setSelectedParent(selected as { value: string; label: string } | null)}
                options={parentOptions}
                isClearable
            />

            <div className='flex justify-end'>
                <Button type="submit">
                    {isPending ? <LoadingSpinner /> : "Create Category"}
                </Button>
            </div>
        </form>
    );
};

export default CategoryForm;