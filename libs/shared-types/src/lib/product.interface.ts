export interface Product {
    // The product ID
    id: string;

    // Product details
    name: string;
    description: string;
    price: number;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;

    // Optional fields
    imageUrls?: string[];

    // TODO: Add more fields as needed
}