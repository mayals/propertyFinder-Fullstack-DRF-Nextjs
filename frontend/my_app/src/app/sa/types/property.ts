// types/property.ts




//  property
//  This file defines TypeScript interfaces for the property-related data structures used in the application.
export interface ProfileObj {
                id: string;
                country?: string | null;
                address?: string | null;
                date_of_birth?:  Date  | null;
                gender?: string | null;
                phone_number?: string | null;
                profile_picture?: string | null;
                created_at?:  Date  | null;
                updated_at?:  Date  | null;
}



export interface OwnerObj {
                id: string;
                first_name: string; 
                last_name: string;        
                full_name: string;             
                role: string;
                email: string;           
                is_active: boolean | null; 
                is_verifiedEmail: boolean | null; 
                date_joined?: Date | null;
                last_login?: Date | null;
                profile?: ProfileObj | null; //profile should be a single object, not an array
}



export interface CityObj {
                id: string;              
                city_name: string;
                city_slug: string;
                country: string;                           
}


export interface CountryObj {
                id: string;
                code:string;
                country_name:string;
                country_slug:string;
                cities : string[];
}


export interface PmainTypeObj {
                id: string;
                maintype_label?: string | null;
                maintype_name?: string | null;
                created_at?: Date | null;
                updated_at?: Date | null;
}


export interface PsubTypeObj {
                id: string;
                main_type?: string | null;
                subtype_name?: string | null;
                created_at?: Date | null;
                updated_at?: Date | null;
                properties: string[] | null;
}


export interface PurposeObj {
                id: string;
                purpose_name?: string | null;
                created_at?: Date | null;
                updated_at?: Date | null;
}


export interface Property {
                id?: string;
                title?: string | null;
                address_detail ?: string;
                available_from?: string;
                category?: string | null;
                currency?: string | null;
                description?: string | null;
                district?: string | null;               
                facade?: string | null; 
                furnishing?: string | null; 
                land_number?: string | null; 
                plot_number?: string | null;
                bathrooms?: number | null;
                bedrooms?: number | null;
                area?: number | null;
                latitude?: number | null;
                longitude?: number | null;  
                plot_length?: number | null;
                plot_width?: number | null;
                price?: number | null;
                property_age?: number | null;
                property_size?: number | null;
                street_width?: number | null;
                is_occupied?: boolean | null; 
                is_published?: boolean | null;    
                owner?: OwnerObj | null;  //owner should be a single object, not an array
                country?: CountryObj | null;
                city?: CityObj | null;
                amenities?: AmenitiesObj[] | null;
                images?: ImageObj[] | null;
                pmain_type?: PmainTypeObj | null;   
                psub_type?: PsubTypeObj | null;
                purpose?: PurposeObj | null; 
                lunched_price?: number | null;
                created_at?: Date | null;
                updated_at?: Date | null;
}

export interface AmenitiesObj {
    id: string;
    amenity_name: string;
    amenity_name_ar: string;
    created_at: string;
    updated_at: string;
}



export interface ImageObj {
  id: number;
  url: string;   // backend key
  alt?: string;
}



//  new project type for project listings and details (for developer only)

// for developer only project listings and details
export interface user {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    is_active: boolean;
    is_verifiedEmail: boolean;
    date_joined: string;
    last_login: string;
    profile?: {
        developer_name: string;
        profile_picture: string;
    } | null;
};



export interface City {
    id: string;
    city_name: string;
}




// New PROJECT type (for project listings and details)
export interface NewProject {
    id: string;
    user: user;
    images: {id: number; images: string;}[];
    videos?: {id: number; video_url: string;}[];
    documents?: {id: number; file_url: string;}[];
    nproj_name: string;
    developer: string;
    description: string;
    nproj_main_type: string;
    nproj_main_type_slug: string;
    lunch_price: number;
    currency: string;
    country: string;
    city: City;
    district: string;
    image: string;
    status: string;
    completion: string;
    units: string;
    full_area: number;
    latitude: number;
    longitude: number;
    hand_over_year: number;
    hand_over_year_quarter: string;
    status_detail: string;
    amenities: string[];
    created_at: string;
    updated_at: string;
    is_published: boolean;
    address_detail: string;
}



// Media item type for carousel (image, video, document)
export type MediaItem = {
  type: "image" | "video" | "document";
  url: any;
  videos: string;
  video:any;
  images: string;
  documents: string;
  name?: any; // optional for documents
};
   

