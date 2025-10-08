// src/app/addProperty/images/[property_id]/page.tsx
"use client";

import React, { useState, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { uploadPropertyImages } from  "../../../../utils/property";
import { toast } from "react-hot-toast";
// react-toastify
// import notify from "../../common/useNotification"
// import { ToastContainer, toast } from 'react-toastify';





export default function UploadImagesPage() {
    const router = useRouter();
    // const { propertyId } = useParams<{ propertyId: string }>();
    // console.log("UploadImagesPage-propertyId=", propertyId)
     
    const params = useParams();
    console.log("UploadImagesPage-params=", params)
    const propertyId  = Array.isArray(params.propertyId)? params.propertyId[0]: params.propertyId;
    console.log("UploadImagesPage-propertyId=", propertyId)

    
    
    


    const [images, setImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setImages(filesArray);
            setPreviewUrls(filesArray.map(file => URL.createObjectURL(file)));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!images.length) {
            toast.error("Please select at least one image!");
            return;
        }

        const formData = new FormData();
        images.forEach((file) => formData.append("images", file));

        try {
            setIsLoading(true);
            const response = await uploadPropertyImages(propertyId, formData);
            toast.success(response.detail || "Images uploaded successfully!");
            console.log("response.detail=",response.detail)
            

            setImages([]);
            setPreviewUrls([]);

            // Navigate to next step (optional)
            setTimeout(() => router.push("/dashboard"), 2000);

        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error("Failed to upload images!");
        
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Upload Property Images 🏠
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-indigo-500 transition cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <p className="text-gray-600 text-center">
              Click or drag images here to upload
            </p>
          </label>

          {/* Image previews */}
          {previewUrls.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative w-full aspect-square">
                  <Image
                    src={url}
                    alt={`preview-${index}`}
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl text-white font-semibold ${
              isLoading ? "bg-indigo-300" : "bg-indigo-600 hover:bg-indigo-700"
            } transition`}
          >
            {isLoading ? "Uploading..." : "Upload Images"}
          </button>
        </form>
      </div>
    </section>
  );
}
