type MeasurementSystem = "CLOTHING_ALPHA" | "CLOTHING_NUMERIC" | "CUP_SIZE" | "WEIGHT_KG" | "LENGTH_CM";

const measurementSystemOptions = Object.freeze([
    { value: "CLOTHING_ALPHA", label: "Clothing (M, L, XL)" },
    { value: "CLOTHING_NUMERIC", label: "Clothing (32, 34, 36, 38, 40, 42, 44, 46)" },
    { value: "CUP_SIZE", label: "Cup Size (A, B, C, D)" },
    { value: "WEIGHT_KG", label: "Weight (kg)" },
    { value: "LENGTH_CM", label: "Length (cm)" }
]);

const generateCategoryMeasurements = (categoryMeasurementSystem: MeasurementSystem) => {
    switch (categoryMeasurementSystem) {
        case "CLOTHING_ALPHA":
            return ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "OneSize"];
        case "CLOTHING_NUMERIC":
            return [32, 34, 36, 38, 40, 42, 44, 46];
        case "CUP_SIZE":
            return ["A", "B", "C", "D"];
        case "WEIGHT_KG":
            return Array.from({ length: 100 }, (_, i) => i);
        case "LENGTH_CM":
            return Array.from({ length: 100 }, (_, i) => i);
        default:
            return [];
    }
};

export { generateCategoryMeasurements, measurementSystemOptions };