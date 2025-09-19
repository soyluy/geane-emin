import { BusinessType } from '../enum/business-type.enum.js';
import { BusinessScale } from '../enum/business-scale.enum.js';
import { ProductionType } from '../enum/production-type.enum.js';
export interface Supplier {
    // The supplier ID
    id: string;

    // Owner details, typically a user ID
    ownerId: string;

    // Supplier details
    name: string;
    contactEmail: string;
    phone: string;
    description: string;
    businessType: BusinessType | null;  // Business type can be null if not specified
    businessScale: BusinessScale | null;  // Business scale can be null if not specified
    productionType: ProductionType | null;  // Production type can be null if not specified


    // Timestamps
    createdAt: Date;
    updatedAt: Date;

    // Optional fields
    logoUrl?: string;
    introVideoUrl?: string;

    // TODO: Add more fields as needed
}

