import React from "react";
import Link from "next/link";

export default function Custom404() {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-xl text-center">
          <h1 className="text-6xl font-extrabold text-gray-800 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-6">
            Oops! The page you’re looking for doesn’t exist.
          </p>

          <Link href="/dashboard">
            <div className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition cursor-pointer">
              Go to Dashboard
            </div>
          </Link>

          <p className="text-sm text-gray-500 mt-4">
            If you think this is a mistake, check the URL or contact support.
          </p>
        </div>
      </div>
    </>
  );
}
