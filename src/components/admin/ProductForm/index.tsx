"use client";

import { Input } from "@/components/ui/input";
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { CldUploadButton, CloudinaryUploadWidgetResults, CloudinaryUploadWidgetInfo } from 'next-cloudinary';
import { useRef, useState, useTransition } from "react";
import { Card } from "@/components/ui/card";
import { CloudUploadIcon, CopyIcon, GalleryThumbnailsIcon, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'react-toastify';
import { TProductImage } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { toastOptions } from "@/utils/toastOptions";

const ProductForm = () => {
    const formRef = useRef<HTMLFormElement>(null)
    const [uploadedImages, setUploadedImages] = useState<TProductImage[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [deletingImage, setDeletingImage] = useState<boolean>(false);
    const [price, setPrice] = useState<number>(0);
    const [discount, setDiscount] = useState<number>(0);
    const [isPending, startTransition] = useTransition();

    console.log("Uploaded images:", uploadedImages);

    // Filter the uploaded image and match the public id to make the thumbnail true
    const handleMakeThumbnail = (public_id: string) => {
        const updatedImages = uploadedImages
            .map((image) => ({ ...image, thumbnail: image.public_id === public_id }))
            .sort((a, b) => (b.thumbnail ? 1 : 0) - (a.thumbnail ? 1 : 0)); // Thumbnail first

        setUploadedImages(updatedImages);
        toast.success("Thumbnail set successfully.", toastOptions);
    };


    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            formData.append("images", JSON.stringify(uploadedImages));

            if (uploadedImages.length < 1) {
                toast.error("Upload at least one image.", toastOptions);
                return;
            }
            console.log("Submitting form with data:", formData.entries());
            // Call API to create product
            const res = await fetch(`/api/product`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json();
                toast.error(errorData.message || 'Failed to create product.', toastOptions);
                return;
            }

            const data = await res.json();
            // console.log("API response data:", data);
            // Reset form state
            setUploadedImages([]);
            setPrice(0);
            setDiscount(0);
            formRef.current?.reset();

            toast.success(`${data.message}`, toastOptions);
        })
    }

    const handleCancelSubmission = async () => {
        startTransition(() => {
            // Reset form state
            resetForm();
        });

        toast.info("Form submission cancelled.", toastOptions);
    };

    const resetForm = async () => {
        console.log("Resetting form...");
        // delete all cloudinary images and reset form
        const public_ids = uploadedImages.map((image) => image.public_id);
        if (public_ids.length > 0) {
            const res = await fetch(`/api/delete-image`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ public_ids }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success("All images deleted successfully.", toastOptions);
            } else {
                toast.error("Failed to delete some images.", toastOptions);
            }
        }

        // Reset form state
        setUploadedImages([]);
        setPrice(0);
        setDiscount(0);
        setIsUploading(false);
        setDeletingImage(false);
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
            <form
                ref={formRef}
                onSubmit={(e) => {
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
                                                    {
                                                        !image.thumbnail &&
                                                        <div className="absolute top-0 left-0">
                                                            <Button onClick={() => handleMakeThumbnail(image.public_id)} className="size-fit !p-0.5 rounded-sm">
                                                                <GalleryThumbnailsIcon />
                                                            </Button>
                                                        </div>
                                                    }
                                                    {deletingImage ? <LoadingSpinner /> :
                                                        <Button variant={"outline"} size={"icon"}>
                                                            <CopyIcon />
                                                        </Button>
                                                    }
                                                </div>
                                                {
                                                    image.thumbnail &&
                                                    <div className="absolute group-hover:hidden flex top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
                                                        <Badge>Thumbnail</Badge>
                                                    </div>
                                                }
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
                                    onClick={() => setIsUploading(true)}
                                    onAbort={() => {
                                        setIsUploading(false);
                                        console.log("Cloudinary upload aborted");
                                    }}
                                    onError={(error) => {
                                        setIsUploading(false);
                                        if (error) {
                                            console.error("Cloudinary upload error:", error);
                                            toast.error("Failed to upload image.", toastOptions);
                                        }
                                    }}
                                    onSuccess={(result: CloudinaryUploadWidgetResults) => {
                                        const info = result.info as CloudinaryUploadWidgetInfo;
                                        setUploadedImages((prev) => [...prev, {
                                            public_id: info.public_id,
                                            secure_url: info.secure_url,
                                            height: info.height,
                                            width: info.width,
                                            thumbnail: false,
                                        }]);
                                        setIsUploading(false);
                                        console.log("Cloudinary upload successful:", result);
                                    }}
                                >
                                    {isUploading ? (
                                        <LoadingSpinner />
                                    ) : (
                                        <>
                                            <CloudUploadIcon className="h-6 w-6 text-white" />
                                            <span>Upload Image</span>
                                        </>
                                    )}
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
                        isClearable={true}
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
                    <Button type="submit" className="mt-4">
                        {isPending ? <LoadingSpinner /> : "Submit"}
                    </Button>
                    <Button disabled type="button" variant="outline" className="mt-4">Save as Draft</Button>

                    <Button onClick={handleCancelSubmission} type="reset" variant="outline" className="mt-4">
                        {isPending ? <LoadingSpinner /> : "Cancel"}
                    </Button>
                </div>
            </form>
        </div >
    );
};

export default ProductForm;