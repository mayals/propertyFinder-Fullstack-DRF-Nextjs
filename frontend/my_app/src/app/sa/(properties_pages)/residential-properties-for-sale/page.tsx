// src/app/sa/(dynamic_pages)/residential-properties-for-sale/page.js  -- SSR
import DynamicPropertiesClient from "../../components/DynamicPropertiesClient";
import Footer from "../../components/Footer";

export default function ResidentialSalePage() {
    return (
        <section >
            <DynamicPropertiesClient 
                maintypeSlug="residential" 
                purposeSlug="sale" 
            />
            <Footer />
        </section>
    );
}
