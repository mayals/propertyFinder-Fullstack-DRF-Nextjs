// src/app/sa/(pages_pages)/blog/page.tsx
"use client";
import Link from "next/link";
import Image from "next/image";

export default function BlogPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat bg-gray-50">
      <div className="max-w-md mx-auto text-center bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
        <Image
          src="/under-construction.png"
          alt="Under Construction"
          width={300}
          height={300}
          className="mx-auto mb-4"
        />
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Blog Under Construction</h1>
        <p className="text-lg text-gray-600 mb-8">
          We're working hard to bring you awesome content. Stay tuned!
        </p>
        <Link
          href="/sa"
          className="inline-block bg-indigo-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors duration-300"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
