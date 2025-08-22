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

type UploadedImageType = {
    public_id: string;
    secure_url: string;
    height: number;
    width: number;
};

const ProductForm = () => {
    const [uploadedImages, setUploadedImages] = useState<UploadedImageType[]>([]);
    const [deletingImage, setDeletingImage] = useState<boolean>(false);
    console.log("Uploaded images:", uploadedImages);

    const handleSubmit = (formData: FormData) => {
        const data = {
            name: formData.get("name"),
            description: formData.get("description"),
            price: formData.get("price"),
        };

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

    return (
        <div>
            <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleSubmit(formData);
            }}>

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
                                            width: info.width
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

                <Input
                    name="name"
                    placeholder="Product Name"
                    className=""
                />

                <Input
                    name="description"
                    placeholder="Product Description"
                    className=""
                />
                <Select
                    name="tags"
                    options={tags}
                    isMulti
                />
                <CreatableSelect
                    name="features"
                    options={features}
                    isMulti
                    isClearable={true}
                />

                <Input
                    name="price"
                    type="number"
                    placeholder="Product Price"
                    className=""
                />
                <Input
                    name="discount"
                    type="number"
                    placeholder="Product Discount (0-100) percentage"
                    className=""
                />
                <Input
                    name="stock"
                    type="number"
                    placeholder="Product Stock"
                    className=""
                />

                <button type="submit">Submit</button>
            </form>
        </div >
    );
};

export default ProductForm;