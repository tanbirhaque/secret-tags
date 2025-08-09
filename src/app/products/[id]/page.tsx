"use client"

import { useState } from "react";
import { ArrowLeft, Star, Heart, Share2, Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Mock product data (in real app, this would come from an API)
const mockProduct = {
    id: 1,
    name: "Modern Ceramic Vase",
    price: 89.99,
    originalPrice: 109.99,
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    category: "Home Decor",
    rating: 4.8,
    reviews: 124,
    isNew: true,
    inStock: true,
    description: "This elegant minimalist ceramic vase is perfect for modern homes. Crafted with premium materials and designed to complement any contemporary interior design aesthetic.",
    features: [
        "High-quality ceramic construction",
        "Minimalist modern design",
        "Perfect for fresh or dried flowers",
        "Easy to clean and maintain",
        "Suitable for any room"
    ],
    specifications: {
        "Material": "Premium Ceramic",
        "Height": "12 inches",
        "Width": "6 inches",
        "Weight": "2.5 lbs",
        "Color": "Matte White"
    }
};

const ProductDetail = () => {
    const { id } = useParams();
    console.log(`Product ID: ${id}`); // For debugging purposes
    // const { toast } = useToast();
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    // In a real app, you'd fetch the product based on the ID
    const product = mockProduct;

    const handleAddToCart = () => {
        // toast({
        //     title: "Added to Cart",
        //     description: `${quantity} ${product.name} added to your cart.`,
        // });
    };

    const handleQuantityChange = (delta: number) => {
        setQuantity(Math.max(1, quantity + delta));
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="mb-6">
                <Link href="/products" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Products
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Product Images */}
                <div className="space-y-4">
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                        <Image
                            src={product.images[selectedImage]}
                            alt={product.name}
                            fill={true}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto">
                        {product.images.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index ? "border-primary" : "border-border"
                                    }`}
                            >
                                <Image
                                    src={image}
                                    width={80}
                                    height={80}
                                    alt={`${product.name} view ${index + 1}`}
                                    className="w-full h-full object-cover bg-muted"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{product.category}</Badge>
                            {product.isNew && (
                                <Badge className="bg-primary text-primary-foreground">New</Badge>
                            )}
                        </div>
                        <h1 className="text-3xl font-bold text-foreground mb-4">{product.name}</h1>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${i < Math.floor(product.rating)
                                                ? "fill-primary text-primary"
                                                : "text-muted-foreground"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="ml-2 font-medium">{product.rating}</span>
                                <span className="text-muted-foreground ml-1">
                                    ({product.reviews} reviews)
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-3xl font-bold text-primary">${product.price}</span>
                            {product.originalPrice && (
                                <span className="text-xl text-muted-foreground line-through">
                                    ${product.originalPrice}
                                </span>
                            )}
                            {product.originalPrice && (
                                <Badge variant="destructive">
                                    Save ${(product.originalPrice - product.price).toFixed(2)}
                                </Badge>
                            )}
                        </div>

                        <p className="text-muted-foreground leading-relaxed mb-6">
                            {product.description}
                        </p>

                        {/* Quantity and Add to Cart */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="font-medium">Quantity:</span>
                                <div className="flex items-center border border-border rounded-lg">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </Button>
                                    <span className="px-4 py-2 font-medium">{quantity}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleQuantityChange(1)}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    onClick={handleAddToCart}
                                    className="flex-1 btn-hero"
                                    disabled={!product.inStock}
                                >
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                                </Button>
                                <Button variant="outline" size="icon">
                                    <Heart className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="icon">
                                    <Share2 className="w-4 h-4" />
                                </Button>
                            </div>

                            {product.inStock && (
                                <p className="text-green-600 text-sm font-medium">✓ In stock and ready to ship</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-4">Product Features</h3>
                        <ul className="space-y-2">
                            {product.features.map((feature, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="text-primary mr-2">•</span>
                                    <span className="text-muted-foreground">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-4">Specifications</h3>
                        <div className="space-y-3">
                            {Object.entries(product.specifications).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                    <span className="font-medium">{key}:</span>
                                    <span className="text-muted-foreground">{value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ProductDetail;