"use client"

import { useState } from "react";
import { Search, Grid, List, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

// Mock product data
const mockProducts = [
    {
        id: 1,
        name: "Modern Ceramic Vase",
        price: 89.99,
        originalPrice: 109.99,
        image: "/placeholder.svg",
        category: "Home Decor",
        rating: 4.8,
        reviews: 124,
        isNew: true,
        description: "Elegant minimalist design perfect for modern homes"
    },
    {
        id: 2,
        name: "Luxury Throw Pillow Set",
        price: 45.99,
        image: "/placeholder.svg",
        category: "Accessories",
        rating: 4.6,
        reviews: 89,
        description: "Premium comfort meets sophisticated style"
    },
    {
        id: 3,
        name: "Wooden Coffee Table",
        price: 299.99,
        image: "/placeholder.svg",
        category: "Furniture",
        rating: 4.9,
        reviews: 156,
        isFeatured: true,
        description: "Handcrafted solid wood with contemporary design"
    },
    {
        id: 4,
        name: "Kitchen Utensil Set",
        price: 59.99,
        originalPrice: 79.99,
        image: "/placeholder.svg",
        category: "Kitchen",
        rating: 4.7,
        reviews: 203,
        description: "Professional-grade tools for culinary enthusiasts"
    },
    {
        id: 5,
        name: "Ambient Floor Lamp",
        price: 189.99,
        image: "/placeholder.svg",
        category: "Home Decor",
        rating: 4.5,
        reviews: 67,
        description: "Create the perfect atmosphere in any room"
    },
    {
        id: 6,
        name: "Ergonomic Office Chair",
        price: 249.99,
        image: "/placeholder.svg",
        category: "Furniture",
        rating: 4.8,
        reviews: 98,
        isNew: true,
        description: "Comfort and productivity in perfect harmony"
    }
];

const Products = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = ["All", "Home Decor", "Furniture", "Kitchen", "Accessories"];

    const filteredProducts = mockProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div>
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Products</h1>
                    <p className="text-muted-foreground">Discover our curated collection of lifestyle products</p>
                </div>

                {/* Filters and Search */}
                <div className="flex flex-col lg:flex-row gap-4 mb-8">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Category Filter */}
                        <div className="flex gap-2 overflow-x-auto">
                            {categories.map((category) => (
                                <Button
                                    key={category}
                                    variant={selectedCategory === category ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedCategory(category)}
                                    className="whitespace-nowrap"
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>

                        {/* View Toggle */}
                        <div className="flex border border-border rounded-lg">
                            <Button
                                variant={viewMode === "grid" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setViewMode("grid")}
                                className="rounded-r-none"
                            >
                                <Grid className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={viewMode === "list" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setViewMode("list")}
                                className="rounded-l-none"
                            >
                                <List className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6">
                    <p className="text-muted-foreground">
                        Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Products Grid */}
                <div className={viewMode === "grid"
                    ? "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    : "space-y-4"
                }>
                    {filteredProducts.map((product) => (
                        <Link key={product.id} href={`/products/${product.id}`}>
                            <Card className="product-card p-0 gap-0 group h-full">
                                <div className="relative w-full h-48 overflow-hidden">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill={true}
                                        className="product-card-image w-full h-48 bg-muted rounded-t-xl"
                                    />
                                    <div className="absolute top-2 left-2 flex gap-2">
                                        {product.isNew && (
                                            <Badge className="bg-primary text-primary-foreground">New</Badge>
                                        )}
                                        {product.isFeatured && (
                                            <Badge variant="secondary">Featured</Badge>
                                        )}
                                        {product.originalPrice && (
                                            <Badge variant="destructive">Sale</Badge>
                                        )}
                                    </div>
                                </div>

                                <CardContent className="p-4">
                                    <div className="mb-2 flex justify-between items-center">
                                        <div>
                                            <Badge variant="outline" className="text-xs">
                                                {product.category}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {/* <span className="text-muted-foreground text-sm">
                                                ({product.reviews} reviews)
                                            </span> */}
                                            <div className="flex items-center">
                                                <Star className="w-4 h-4 fill-primary text-primary" />
                                                <span className="ml-1 text-sm font-medium">{product.rating}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                                        {product.name}
                                    </h3>

                                    <p className="text-mut-+**ed-foreground text-sm mb-3 line-clamp-2">
                                        {product.description}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-primary">
                                                ${product.price}
                                            </span>
                                            {product.originalPrice && (
                                                <span className="text-sm text-muted-foreground line-through">
                                                    ${product.originalPrice}
                                                </span>
                                            )}
                                        </div>

                                        <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            View Details
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedCategory("All");
                            }}
                            className="mt-4"
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;