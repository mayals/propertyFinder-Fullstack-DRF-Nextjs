// src/app/sa/(dynamic_pages)/residential-properties-for-rent/page.js
import DynamicPropertiesClient from "../../components/DynamicPropertiesClient";
import Footer from "../../components/Footer";


export default function ResidentialRentPage() {
  return (
    <section>
          <DynamicPropertiesClient 
              maintypeSlug="residential" 
              purposeSlug="rent" 
          />
          <Footer />
    </section>
  );
};
