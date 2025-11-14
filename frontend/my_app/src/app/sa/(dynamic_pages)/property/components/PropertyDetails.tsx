// components/PropertyDetails.tsx
import React from "react";
import type { Property } from "../types/property";
import Image from "next/image";



export default function PropertyDetails({ property }: { property: Property }) {
    return (
    <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 bg-green-400">
        <div className="lg:col-span-2">
            <section className="prose max-w-none">
                <h2>Description</h2>
                <p>{property.description || 'No description provided.'}</p>
            </section>


            <section className="mt-6">
                <h3 className="text-lg font-semibold">Features</h3>
                <ul className="list-disc ml-5 mt-2">
                    {(property.features && property.features.length > 0) ? 
                    (
                        property.features.map((f, idx) => <li key={idx}>{f}</li>)
                    ) : (
                        <li>No features listed.</li>
                    )}
                </ul>
            </section>
        </div>


        <aside className="bg-white border rounded-lg p-4 shadow">
            <h4 className="font-semibold">Agent</h4>
            {property.agent ? (
                <div className="mt-3 flex items-center gap-3">
                    <Image src={property.agent.avatar || '/default-avatar.png'} alt={property.agent.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                        <div className="font-medium">
                            {property.agent.name}
                        </div>
                        <div className="text-sm text-gray-600">
                            {property.agent.phone}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-sm text-gray-500 mt-2">No agent info</div>
            )}

            <a href={`tel:${property.agent?.phone || ''}`} className="block mt-4 w-full text-center py-2 border rounded hover:bg-gray-50">
                Call
            </a>
        </aside>
    </div>
    );
}
