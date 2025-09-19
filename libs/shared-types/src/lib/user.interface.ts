export interface User {
    // Required properties
    // The user ID
    userId: string;

    // Authentication 
    email: string;
    username: string;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
    
    // User roles
    roles: string[];
    
    // Miscellaneous
    isActive: boolean;
    isVerified: boolean;
    
    // Optional properties
    // Personal information
    firstName?: string;
    lastName?: string;
    birthdate?: Date;
    profilePictureUrl?: string;
}

export type CreateUserShape = Omit<User, 'userId' | 'createdAt' | 'updatedAt' | 'isActive' | 'isVerified' | 'roles'> & { passwordHash?: string }; 
export type UpdateUserShape = Partial<CreateUserShape>;
export type LoginUserShape = User & { passwordHash: string };