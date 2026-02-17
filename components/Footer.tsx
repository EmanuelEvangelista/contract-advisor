import React from "react";
import Image from "next/image";
import logo from "@/assets/images/logo-nestrly.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-slate-100 via-blue-50 to-white py-12 mt-24 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image src={logo} alt="Logo" className="h-9 w-auto" />
            <span className="text-lg font-semibold text-slate-800">
              Nestrly
            </span>
          </div>

          <div className="text-center md:text-right">
            <p className="text-sm text-slate-500">
              © {currentYear} Nestrly. Designed for modern living.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
