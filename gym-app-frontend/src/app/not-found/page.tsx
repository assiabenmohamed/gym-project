import Link from "next/link";
import React from "react";

function page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-accent">404 - Not Found</h2>
      <p className="mb-4">This page could not be found.</p>
      <Link href="/" className="text-blue-500 hover:underline">
        Return Dashboard
      </Link>
    </div>
  );
}

export default page;
