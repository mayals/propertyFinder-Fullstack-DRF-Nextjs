import React from "react";
import type { NewProject} from "../types/property";
import Image from "next/image";
import { LiaBedSolid } from "react-icons/lia";
import { PiBathtub } from "react-icons/pi";
import { RxDimensions } from "react-icons/rx";
import { Phone, Mail, MessageCircle } from "lucide-react";
import Link from "next/link";



export default function NewProjectHeader({ newProject }: { newProject: NewProject }) {
  // Guard against missing user data
  if (!newProject?.user) {
    console.warn('NewProjectHeader: missing user data');
    return null;
  }
  
    console.log("PropertyHeader-property=",newProject )
    const apiURL = process.env.NEXT_PUBLIC_API_URL;
    const imageURL = newProject.user?.profile?.profile_picture 
    ? `${apiURL}${newProject.user?.profile?.profile_picture}`.replace(/\/+/, "/")
    : null;
    console.log("PropertyHeader-imageURL=",newProject.user?.profile?.profile_picture)

  return (
    <div className="w-full bg-white rounded-lg shadow p-4 md:p-6 mt-6">
      <div className="grid md:grid-cols-3 gap-6">

        {/* ============================
             LEFT: PRICE + PROPERTY SPECS
        =============================== */}
        <div className="col-span-2 flex flex-col gap-4">

          {/* Price */}
          <div>
            <p className="text-3xl font-bold text-gray-900">
              {newProject.lunched_price} {newProject.currency || "SAR"}
            </p>
           
          </div>

         
        </div>

        {/* ============================
             RIGHT: AGENT BOX
        =============================== */}
        <div className="col-span-1 flex items-center justify-center">
              <aside className="border rounded-2xl p-4 shadow-sm flex flex-col bg-gray-50 w-full max-w-md">
        

                      <h3 className="ont-semibold text-gray-900 text-lg mb-3">Provider</h3>

                      {/* owner NAME */}
                      {/* <p className="text-gray-900 font-bold mt-1">
                          {property.owner?.full_name || "Not Provided"}
                      </p> */}

                      
                  


                

                {/* Owner info */}
                <div className="flex flex-col items-center">
                  <span className="text-sm font-medium text-gray-700">
                    {newProject.user?.first_name || "Property Owner"}
                  </span>

                  {newProject.user?.profile?.profile_picture && (
                    <Image
                      src={imageURL}
                      alt="Agent photo"
                      width={80}
                      height={80}
                      className="rounded-full mt-2 object-cover"
                    />
                  )}
                  </div>
                  {/* Buttons */}
                  {/* AGENT CONTACT BUTTONS */}
                      <div className="mt-4 w-full space-y-3">

                          {/* CALL + WHATSAPP SIDE BY SIDE */}
                          <div className="flex gap-2 w-full">
                              
                              {/* CALL */}
                              <a
                                  href={`tel:${newProject.user?.profile?.phone_number || ""}`}
                                  className="flex-1 flex items-center justify-center gap-1 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                              >
                                  <Phone size={18} />
                                  Call
                              </a>

                              {/* WHATSAPP */}
                              <a
                                  href={`https://wa.me/${newProject.user?.profile?.phone_number|| ""}`}
                                  className="flex-1 flex items-center justify-center gap-1 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                              >
                                  <MessageCircle size={18} />
                                  WhatsApp
                              </a>
                          </div>

                          {/* EMAIL */}
                          <a
                              href={`mailto:${newProject.user?.email || ""}`}
                              className="flex items-center justify-center gap-1 w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                          >
                              <Mail size={18} />
                              Email
                          </a>

                          {/* MESSAGE - In-App - Primary Button */}
                          <Link
                              href={`/sa/send-message?receiver=${newProject.user?.id || ""}&name=${encodeURIComponent(newProject.user?.first_name || "Owner")}&property=${newProject.id}&title=${encodeURIComponent(newProject.title || "")}`}
                              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium shadow-md hover:shadow-lg"
                          >
                              <MessageCircle size={18} />
                              Message {newProject.user?.first_name || "Owner"}
                          </Link>
                      </div>
              </aside>   
        </div>
      </div>
    </div>
  );
}


