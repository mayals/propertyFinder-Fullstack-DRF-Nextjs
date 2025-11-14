// components/PropertyHeader.tsx
import React from "react";
import type { Property } from "../types/property";


export default function PropertyHeader({ property }: { property: Property }) {
    return (
            // <div className="mt-4 md:flex md:items-center md:justify-between bg-red-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2  bg-red-300 p-3">   
               


                <div className="mt-3 md:mt-0">
                    <div className="text-left">
                        <div className="text-3xl font-bold">
                            {property.price.toLocaleString()}{property.currency || 'SAR'} 
                        </div>
                        <div className="text-sm text-gray-600">
                            {property.bedrooms ?? '-'} bd • {property.bathrooms ?? '-'} ba • {property.area_sqm ?? '-'} m²
                        </div>
                    </div>
                </div>

                 <div>
                    <h1 className="text-2xl font-semibold">{property.title}</h1>
                    <p className="text-sm text-gray-500 mt-1">{property.address}</p>
                </div>
            </div>
    );
}
