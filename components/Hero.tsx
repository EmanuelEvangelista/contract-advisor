import Link from "next/link";
import { FaShieldAlt, FaChartLine, FaFileSignature } from "react-icons/fa";

const Hero = () => {
  return (
    <>
      {/* Hero Content */}
      <main className="max-w-7xl mx-auto px-8 pt-16 pb-24 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-bold tracking-wide uppercase">
            Smart Management for the Agro World
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1]">
            Unlock the Power of <br />
            <span className="text-blue-600">Smart Contract</span> Management
          </h1>
          <p className="text-lg text-slate-500 max-w-lg leading-relaxed">
            Automate, track, and optimize your agricultural agreements with
            ease. The all-in-one platform for modern producers and contractors.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-2xl shadow-slate-200 flex items-center gap-2"
            >
              Get Started Now
            </Link>
          </div>

          {/* Mini Features */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200">
            <div className="flex flex-col gap-2">
              <FaFileSignature className="text-blue-500 text-xl" />
              <span className="text-sm font-bold text-slate-700">
                Legally Secure
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <FaChartLine className="text-blue-500 text-xl" />
              <span className="text-sm font-bold text-slate-700">
                Real-time Tracking
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <FaShieldAlt className="text-blue-500 text-xl" />
              <span className="text-sm font-bold text-slate-700">
                Cloud Storage
              </span>
            </div>
          </div>
        </div>

        {/* Lado Derecho: Imagen o Decoración */}
        <div className="hidden lg:flex justify-center relative">
          <div className="absolute inset-0 bg-blue-400/10 blur-3xl rounded-full"></div>
          <div className="relative bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100 rotate-3 hover:rotate-0 transition-transform duration-500">
            <div className="w-[400px] h-[500px] bg-slate-50 rounded-[24px] overflow-hidden flex flex-col items-center justify-center p-12 text-center">
              <FaShieldAlt className="text-[120px] text-blue-600 mb-6 opacity-20" />
              <div className="space-y-3 w-full">
                <div className="h-4 bg-slate-200 rounded-full w-3/4 mx-auto"></div>
                <div className="h-4 bg-slate-200 rounded-full w-1/2 mx-auto"></div>
                <div className="h-4 bg-slate-200 rounded-full w-5/6 mx-auto pt-8"></div>
              </div>
              <p className="mt-12 text-slate-400 font-medium italic">
                "The future of agro-contracts is here."
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Hero;
