// src/app/sa/(dynamic_pages)/commercial-properties-for-rent/page.js
import DynamicPropertiesClient from "../../components/DynamicPropertiesClient";
import Footer from "../../components/Footer";


export default function CommercialRentPage() {
  return( 
    <section>
        <DynamicPropertiesClient 
            maintypeSlug="commercial" 
            purposeSlug="rent" 
        />
        <Footer />
    </section>
  );
}
