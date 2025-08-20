"use client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProductForm = () => {

    const handleSubmit = (formData: FormData) => {
        const data = {
            name: formData.get("name"),
            description: formData.get("description"),
            price: formData.get("price"),
        };

        console.log("Form submitted with data:", data);
    }

    return (
        <div>
            <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleSubmit(formData);
            }}>
                <Input
                    name="name"
                    placeholder="Product Name"
                    className=""
                />
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Fruits</SelectLabel>
                            <SelectItem value="apple">Apple</SelectItem>
                            <SelectItem value="banana">Banana</SelectItem>
                            <SelectItem value="blueberry">Blueberry</SelectItem>
                            <SelectItem value="grapes">Grapes</SelectItem>
                            <SelectItem value="pineapple">Pineapple</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Input
                    name="description"
                    placeholder="Product Description"
                    className=""
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
        </div>
    );
};

export default ProductForm;