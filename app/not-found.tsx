import React from "react";
import { FaChevronLeft, FaHome } from "react-icons/fa";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <section className="bg-slate-50 min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Visual 404 Element */}
        <div className="mb-4">
          <h1 className="text-[120px] font-black text-slate-200 leading-none">
            404
          </h1>
          <div className="h-1.5 w-16 bg-blue-600 mx-auto rounded-full -mt-4"></div>
        </div>

        {/* Error Text */}
        <h2 className="text-3xl font-extrabold text-slate-800 mb-4">
          Contract Not Found
        </h2>
        <p className="text-slate-500 text-lg mb-10 leading-relaxed">
          The page or document you are looking for doesn't exist or has been
          moved to another department.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-xl shadow-slate-200"
          >
            <FaHome size={18} /> Back to Home
          </Link>

          <Link
            href="/contracts"
            className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-bold py-2 transition-colors"
          >
            <FaChevronLeft size={14} /> View All Contracts
          </Link>
        </div>

        {/* Support Link */}
        <div className="mt-16 pt-8 border-t border-slate-200">
          <p className="text-slate-400 text-sm">
            Need assistance?{" "}
            <span className="text-blue-600 cursor-pointer hover:underline font-medium">
              Contact Support
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
