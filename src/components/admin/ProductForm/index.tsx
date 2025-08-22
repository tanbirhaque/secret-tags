"use client";

import { Input } from "@/components/ui/input";
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { CldUploadButton, CloudinaryUploadWidgetResults, CloudinaryUploadWidgetInfo } from 'next-cloudinary';
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { CloudUploadIcon, CopyIcon, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'react-toastify';
import { TProductImage } from "@prisma/client";

const ProductForm = () => {
    const [uploadedImages, setUploadedImages] = useState<TProductImage[]>([]);
    const [deletingImage, setDeletingImage] = useState<boolean>(false);
    const [price, setPrice] = useState<number>(0);
    const [discount, setDiscount] = useState<number>(0);
    console.log("Uploaded images:", uploadedImages);

    const handleSubmit = (formData: FormData) => {
        const data = {
            images: uploadedImages,
            name: formData.get("name"),
            description: formData.get("description"),
            tags: formData.getAll("tags"),
            features: formData.getAll("features"),
            specifications: {
                material: formData.get("material"),
                height: formData.get("height"),
                width: formData.get("width"),
                weight: formData.get("weight"),
                color: formData.get("color"),
            },
            stock: formData.get("stock"),
            price: formData.get("price"),
            discount: formData.get("discount"),
        };

        if (data.images.length < 1) {
            toast.error('Upload at least one image.', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }



        // toast.success('Product created successfully!', {
        //     position: "bottom-right",
        //     autoClose: 5000,
        //     hideProgressBar: false,
        //     closeOnClick: false,
        //     pauseOnHover: true,
        //     draggable: true,
        //     progress: undefined,
        //     theme: "light",
        // });

        console.log("Form submitted with data:", data);
    }

    const handleImageDeleteFromCloudinary = async (public_id: string) => {
        try {
            setDeletingImage(true);
            // Call backend API to delete uploaded image from cloudinary
            const res = await fetch(`/api/delete-image`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ public_id }),
            });

            const data = await res.json();

            if (data.success) {
                setUploadedImages((prev) =>
                    prev.filter((image) => image.public_id !== public_id)
                );
            } else {
                console.error("Delete failed", data.error);
            }
        } catch (error) {
            console.error("Error deleting image:", error);
        } finally {
            setDeletingImage(false);
        }
    };


    const tags = [
        { value: 'sale', label: 'Sale' },
        { value: 'fixed', label: 'Fixed' },
        { value: 'new', label: 'New' },
    ];

    const features = [
        { value: 'waterproof', label: 'Waterproof' },
        { value: 'wireless', label: 'Wireless' },
        { value: 'smart', label: 'Smart' },
    ];

    const categories = [
        { value: 'electronics', label: 'Electronics' },
        { value: 'clothing', label: 'Clothing' },
        { value: 'home', label: 'Home' },
    ];

    const calculatedFinalPrice = (price: number, discount: number) => {
        const discountAmount = price * discount / 100
        if (discount < 0 || discount > 100 || isNaN(discountAmount)) return price;
        const finalPrice = price - discountAmount;
        return finalPrice;
    };

    return (
        <div>
            <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleSubmit(formData);
            }}
                className="space-y-4 flex flex-col"
            >

                <Card className="shadow-none px-5 py-5">
                    <div>
                        <h3 className="text-lg font-semibold">Upload Images</h3>
                        {
                            uploadedImages.length > 0 ? (
                                <>
                                    <div className="flex gap-3">
                                        {uploadedImages.map((image) => (
                                            <div key={image.public_id} className="relative group">
                                                <div className="bg-black/30 absolute inset-0 rounded-sm group-hover:opacity-100 opacity-0 flex justify-center items-center">
                                                    <div className="absolute top-0 right-0">
                                                        <Button onClick={() => handleImageDeleteFromCloudinary(image.public_id)} className="size-fit !p-0.5 rounded-sm">
                                                            <X />
                                                        </Button>
                                                    </div>
                                                    {deletingImage ? <LoadingSpinner /> :
                                                        <Button variant={"outline"} size={"icon"}>
                                                            <CopyIcon />
                                                        </Button>
                                                    }
                                                </div>
                                                <Image src={image.secure_url} width={image.width} height={image.height} alt="" className="h-24 w-24 object-cover rounded-sm border" />
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">Maximum 5 images can be uploaded.</p>
                                </>
                            ) : (
                                <p className="text-sm text-muted-foreground">No images uploaded.
                                    You can upload maximum 5 images for the product.</p>
                            )
                        }
                    </div>
                    {
                        uploadedImages.length < 5 && (
                            <div className="flex items-center justify-center">
                                {/* Upload image to the cloudinary and set the response url in state */}
                                <CldUploadButton
                                    className={"bg-primary text-white flex gap-2 rounded-2xl py-2 px-5 cursor-pointer"}
                                    uploadPreset="secret-tags_dev_product"
                                    options={{ maxFiles: 5 }}
                                    onSuccess={(result: CloudinaryUploadWidgetResults) => {
                                        const info = result.info as CloudinaryUploadWidgetInfo;
                                        setUploadedImages((prev) => [...prev, {
                                            public_id: info.public_id,
                                            secure_url: info.secure_url,
                                            height: info.height,
                                            width: info.width,
                                            thumbnail: false,
                                        }]);
                                        console.log("Cloudinary upload successful:", result);
                                    }}
                                >
                                    <CloudUploadIcon className="h-6 w-6 text-white" />
                                    <span>Upload Image</span>
                                </CldUploadButton>
                            </div>
                        )
                    }
                </Card>

                <div className="space-y-4">
                    <label htmlFor="name" className="text-sm">Product Name</label>
                    <Input
                        name="name"
                        placeholder="Product Name"
                        className=""
                        required
                    />

                    <label htmlFor="description" className="text-sm">Product Description</label>
                    <Textarea
                        name="description"
                        placeholder="Product Description"
                        className=""
                        required
                    />

                    <label htmlFor="category" className="text-sm">Product Category</label>
                    <Select
                        name="category"
                        options={categories}
                    />

                    <label htmlFor="tags" className="text-sm">Product Tags</label>
                    <Select
                        name="tags"
                        options={tags}
                        isMulti
                    />

                    <label htmlFor="features" className="text-sm">Product Features</label>
                    <CreatableSelect
                        name="features"
                        options={features}
                        isMulti
                        isClearable={true}
                    />

                    {/* Product specifications section */}
                    <hr />
                    <p className="text-lg">Products specifications: &#40;Optional&#41;</p>
                    <div className="grid grid-cols-2 gap-4">
                        {/* material, height, width, weight, color */}
                        <div>
                            <label htmlFor="material" className="text-sm">Material</label>
                            <Input
                                name="material"
                                placeholder="Material"
                            />
                        </div>

                        <div>
                            <label htmlFor="height" className="text-sm">Height</label>
                            <Input
                                name="height"
                                type="number"
                                placeholder="Height"
                                className=""
                            />
                        </div>

                        <div>
                            <label htmlFor="width" className="text-sm">Width</label>
                            <Input
                                name="width"
                                type="number"
                                placeholder="Width"
                                className=""
                            />
                        </div>

                        <div>
                            <label htmlFor="weight" className="text-sm">Weight</label>
                            <Input
                                name="weight"
                                type="number"
                                placeholder="Weight"
                                className=""
                            />
                        </div>

                        <div>
                            <label htmlFor="color" className="text-sm">Color</label>
                            <Input
                                name="color"
                                placeholder="Color"
                                className=""
                            />
                        </div>
                    </div>
                    <hr />

                    <label htmlFor="stock" className="text-sm">Product Stock</label>
                    <Input
                        name="stock"
                        type="number"
                        placeholder="Product Stock"
                        required
                    />

                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <label htmlFor="price" className="text-sm">Product Price</label>
                            <Input
                                name="price"
                                type="number"
                                placeholder="Product Price"
                                onChange={(e) => setPrice(parseFloat(e.target.value))}
                                required
                            />
                        </div>

                        <div className="w-1/2">
                            <label htmlFor="discount" className="text-sm">Product Discount (0-100) percentage</label>
                            <Input
                                name="discount"
                                type="number"
                                placeholder="Product Discount (0-100) percentage"
                                onChange={(e) => setDiscount(parseFloat(e.target.value))}
                                required
                            />
                        </div>
                    </div>

                    {/* Final price */}
                    <div className="flex items-center justify-end gap-4">
                        <span className="text-sm">Final Price:</span>
                        <span className="font-semibold text-primary">
                            {calculatedFinalPrice(price, discount)}
                        </span>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Button type="submit" className="mt-4">Submit</Button>
                    <Button type="button" variant="outline" className="mt-4">Save as Draft</Button>
                    <Button type="button" variant="outline" className="mt-4">Cancel</Button>
                </div>
            </form>
        </div >
    );
};

export default ProductForm;