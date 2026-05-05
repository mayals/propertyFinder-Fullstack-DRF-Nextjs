// src/app/sa/(dynamic_pages)/commercial-properties-for-sale/page.js
import DynamicPropertiesClient from "../../components/DynamicPropertiesClient";
import Footer from "../../components/Footer";


export default function CommercialSalePage() {
  return(
    <section>
          <DynamicPropertiesClient 
              maintypeSlug="commercial" 
              purposeSlug="sale" 
          /> 
          <Footer />
    </section>  
  );
}
