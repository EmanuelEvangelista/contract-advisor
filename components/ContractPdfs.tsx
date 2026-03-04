"use client";

import { useState } from "react";
import {
  FaFilePdf,
  FaExternalLinkAlt,
  FaEye,
  FaCopy,
  FaCheck,
} from "react-icons/fa";

interface ContractPDFsProps {
  pdfs: string[]; // Array de URLs de Cloudinary
}

const ContractPdfs = ({ pdfs }: ContractPDFsProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!pdfs || pdfs.length === 0) return null;

  // Truco de Cloudinary: Cambiar extensión .pdf por .jpg para obtener miniatura
  const getThumbnail = (url: string) => {
    return url.replace(/\.pdf$/, ".jpg");
  };

  const copyToClipboard = (url: string, index: number) => {
    navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mt-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-2">
        <FaFilePdf className="text-rose-500" /> Contract Documents
      </h2>

      <div
        className={`grid gap-6 ${pdfs.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}
      >
        {pdfs.map((pdfUrl, index) => (
          <div
            key={index}
            className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-indigo-300 transition-all shadow-sm hover:shadow-md"
          >
            {/* Contenedor de la Imagen / Preview */}
            <div className="aspect-[16/9] bg-slate-200 flex items-center justify-center overflow-hidden relative">
              <img
                src={getThumbnail(pdfUrl)}
                alt={`Contract preview ${index + 1}`}
                className="object-cover object-top w-full h-full group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  // Fallback si Cloudinary aún no procesó la miniatura
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/600x400/e2e8f0/475569?text=PDF+Preview+Available";
                }}
              />

              {/* Overlay con acciones (Se ve al hacer hover) */}
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-slate-900 p-3 rounded-full hover:bg-rose-500 hover:text-white transition-all transform hover:scale-110"
                  title="View Document"
                >
                  <FaEye size={20} />
                </a>
                <button
                  onClick={() => copyToClipboard(pdfUrl, index)}
                  className="bg-white text-slate-900 p-3 rounded-full hover:bg-indigo-500 hover:text-white transition-all transform hover:scale-110"
                  title="Copy Link"
                >
                  {copiedIndex === index ? (
                    <FaCheck size={20} />
                  ) : (
                    <FaCopy size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Barra de información inferior */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-rose-100 p-2 rounded-lg">
                  <FaFilePdf className="text-rose-600" size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">
                    Document {index + 1}
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    PDF File
                  </p>
                </div>
              </div>

              <a
                href={pdfUrl}
                target="_blank"
                className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                OPEN <FaExternalLinkAlt size={10} />
              </a>
            </div>

            {/* Indicador visual de "Copiado" */}
            {copiedIndex === index && (
              <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-bounce">
                LINK COPIED!
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ContractPdfs;
