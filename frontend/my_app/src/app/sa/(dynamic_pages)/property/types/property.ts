// types/property.ts

export interface ImageObj {
    id: number;
    url: string;   // backend key
    alt?: string;
}

export interface Agent {
                id: string;
                name: string;
                phone?: string;
                email?: string;
                avatar?: string;
}


export interface Property {
                id: string;
                title: string;
                price: number;
                currency?: string;
                address?: string;
                bedrooms?: number | null;
                bathrooms?: number | null;
                area_sqm?: number | null;
                description?: string;
                images: ImageObj[];
                features?: string[];
                agent?: Agent | null;
}
