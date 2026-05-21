// src/app/add-new-project/documents/[nprojId]/page.tsx
"use client";
import React, { useState, ChangeEvent, DragEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { uploadNewProjectDocuments} from "../../../../utils/property";
import { Toaster, toast } from "react-hot-toast";



//  for New Project Documents upload page
export default function UploadNewProjectDocumentsPage() {
    const router = useRouter();
    const params = useParams();
    const newProjId = Array.isArray(params.nprojId)? params.nprojId[0] : params.nprojId;
    const [documents, setDocuments] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // --- Handle File Selection ---
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setDocuments((prev) => [...prev, ...filesArray]);
            setPreviewUrls((prev) => [
                ...prev,
                ...filesArray.map((file) => URL.createObjectURL(file)),
            ]);
        }
    };

    // --- Handle Drag Events ---
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = () => setIsDragging(false);
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length > 0) {
            const filesArray = Array.from(e.dataTransfer.files);
            setDocuments((prev) => [...prev, ...filesArray]);
            setPreviewUrls((prev) => [
                ...prev,
                ...filesArray.map((file) => URL.createObjectURL(file)),
            ]);
        }
    };

    console.log("documents=",documents)
    console.log("previewUrls=",previewUrls)


    // --- Remove a selected document ---
    const handleRemoveDocument = (index: number) => {
        const updatedDocuments = documents.filter((_, i) => i !== index);
        const updatedPreviews = previewUrls.filter((_, i) => i !== index);
        setDocuments(updatedDocuments);
        setPreviewUrls(updatedPreviews);
    };

    // --- Submit to backend ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!documents.length) {
            toast.error("Please select at least one document!");
            return;
        }

        const formData = new FormData();
        documents.forEach((file) => formData.append("documents", file));

        try {
            setIsLoading(true);
            const response = await uploadNewProjectDocuments(newProjId,formData);
            toast.success(response.detail || "Documents uploaded successfully!");
            setDocuments([]);
            setPreviewUrls([]);
            setTimeout(() => router.push("/sa/my-dashboard"), 2000);
        
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload documents!");

        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <section className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
            <Toaster position="top-center" />
            <motion.div
                className="bg-white shadow-xl rounded-3xl w-full max-w-3xl p-10"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
            <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
                Upload New Project Documents 📄
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-8">
            {/* Drag + Drop Zone */}
                <motion.div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-2xl transition-all cursor-pointer ${
                    isDragging
                        ? "border-indigo-500 bg-indigo-50 scale-105"
                        : "border-gray-300 hover:border-indigo-400"
                    }`}
                    whileHover={{ scale: 1.02 }}
                >
                    <input
                        type="file"
                        multiple
                        accept="video/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleFileChange}
                    />
                    <p className="text-gray-600 text-center">
                        Drag and drop documents here or <span className="text-indigo-600 font-medium">click to browse</span>
                    </p>
                </motion.div>

                {/* Previews */}
                <AnimatePresence>
                {previewUrls.length > 0 && (
                <motion.div
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {previewUrls.map((url, index) => (
                <motion.div
                    key={index}
                    className="relative group overflow-hidden rounded-2xl shadow-md"
                    whileHover={{ scale: 1.05 }}
                >
                    <Image
                        src={url}
                        alt={`preview-${index}`}
                        width={300}
                        height={200}
                        className="object-cover w-full h-40"
                    />
                    <motion.button
                        type="button"
                        onClick={() => handleRemoveDocument(index)}
                        className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        whileTap={{ scale: 0.9 }}
                    >
                        ✕ 
                    </motion.button>
                </motion.div>
                ))}
                </motion.div>
            )}
            </AnimatePresence>

            {/* Submit button */}
            <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-2xl text-white font-semibold shadow-md ${
                    isLoading ? "bg-indigo-300" : "bg-indigo-600 hover:bg-indigo-700"
                } transition`}
            >
                {isLoading ? "Uploading..." : "Upload Documents"}
            </button>
        </form>
        </motion.div>
        </section>
    );
}
