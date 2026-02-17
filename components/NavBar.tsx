// "use client";
// import { useState, useEffect, useRef } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import logo from "@/assets/images/logo-nestrly.png"; // Puedes cambiar luego al logo de Contract Flow
// // import profileDefault from "@/assets/images/profile.png";
// import { FaGoogle, FaBars, FaBell, FaFileContract } from "react-icons/fa";
// import { usePathname } from "next/navigation";
// import { signIn, signOut, useSession, getProviders } from "next-auth/react";

// const Navbar = () => {
//   const { data: session } = useSession();
//   const profileImage = session?.user?.image || profileDefault;

//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
//   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
//   const [providers, setProviders] = useState<Record<string, any>>(null);

//   const profileMenuRef = useRef<HTMLDivElement>(null);
//   const mobileMenuRef = useRef<HTMLDivElement>(null);

//   const pathname: string = usePathname();

//   useEffect(() => {
//     const setAuthProviders = async () => {
//       const response = await getProviders();
//       setProviders(response);
//     };
//     setAuthProviders();
//   }, []);

//   // Cerrar al hacer clic fuera
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         profileMenuRef.current &&
//         !profileMenuRef.current.contains(event.target as Node)
//       ) {
//         setIsProfileMenuOpen(false);
//       }
//       if (
//         mobileMenuRef.current &&
//         !mobileMenuRef.current.contains(event.target as Node)
//       ) {
//         setIsMobileMenuOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     setIsMobileMenuOpen(false);
//     setIsProfileMenuOpen(false);
//   }, [pathname]);

//   return (
//     <nav className="bg-[#0f172a] border-b border-white/10 backdrop-blur-md fixed top-0 left-0 w-full z-50">
//       <div className="mx-auto max-w-7xl px-6 lg:px-8">
//         <div className="relative flex h-20 items-center justify-between">
//           {/* Botón Móvil */}
//           <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
//             <button
//               type="button"
//               className="inline-flex items-center justify-center rounded-xl p-2 text-slate-300 hover:bg-white/10 hover:text-white transition-all"
//               onClick={() => setIsMobileMenuOpen((prev) => !prev)}
//             >
//               <FaBars className="h-6 w-6" />
//             </button>
//           </div>

//           {/* Logo y Links de Navegación */}
//           <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
//             <Link className="flex items-center space-x-3" href="/">
//               <div className="bg-blue-600 p-2 rounded-lg">
//                 <FaFileContract className="text-white text-xl" />
//               </div>
//               <span className="hidden md:block text-white text-2xl font-bold tracking-tight">
//                 Contract<span className="text-blue-500">Flow</span>
//               </span>
//             </Link>

//             {/* Desktop Links */}
//             <div className="hidden md:ml-10 md:flex items-center">
//               <div className="flex space-x-1 bg-white/5 p-1 rounded-xl border border-white/5">
//                 <Link
//                   href="/"
//                   className={`${pathname === "/" ? "bg-white/10 text-white" : "text-slate-400"} px-4 py-2 rounded-lg text-sm font-medium transition hover:text-white`}
//                 >
//                   Dashboard
//                 </Link>

//                 <Link
//                   href="/contracts"
//                   className={`${pathname === "/contracts" ? "bg-white/10 text-white" : "text-slate-400"} px-4 py-2 rounded-lg text-sm font-medium transition hover:text-white`}
//                 >
//                   Contratos
//                 </Link>

//                 {session && (
//                   <Link
//                     href="/contracts/add"
//                     className={`${pathname === "/contracts/add" ? "bg-blue-600 text-white" : "text-blue-400"} px-4 py-2 rounded-lg text-sm font-medium transition hover:bg-blue-600 hover:text-white`}
//                   >
//                     Nuevo Contrato
//                   </Link>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Derecha: Notificaciones y Perfil */}
//           <div className="flex items-center space-x-4">
//             {!session ? (
//               providers &&
//               Object.values(providers).map((provider, index) => (
//                 <button
//                   key={index}
//                   onClick={() => signIn(provider.id)}
//                   className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-medium transition shadow-lg shadow-blue-900/20"
//                 >
//                   <FaGoogle />
//                   <span>Entrar</span>
//                 </button>
//               ))
//             ) : (
//               <>
//                 <Link
//                   href="/messages"
//                   className="relative rounded-xl bg-white/5 p-2 text-slate-300 hover:bg-white/10 hover:text-white transition"
//                 >
//                   <UnreadMessageCount session={session} />
//                   <FaBell className="h-5 w-5" />
//                 </Link>

//                 <div className="relative">
//                   <button
//                     className="flex rounded-full ring-2 ring-white/10 hover:ring-blue-500 transition-all"
//                     onClick={() => setIsProfileMenuOpen((prev) => !prev)}
//                   >
//                     <Image
//                       className="h-9 w-9 rounded-full"
//                       src={profileImage}
//                       alt="Perfil"
//                       width={36}
//                       height={36}
//                     />
//                   </button>

//                   {isProfileMenuOpen && (
//                     <div
//                       ref={profileMenuRef}
//                       className="absolute right-0 z-10 mt-3 w-52 rounded-xl bg-[#111827] border border-white/10 shadow-2xl py-2 overflow-hidden"
//                     >
//                       <Link
//                         href="/profile"
//                         className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/10 transition"
//                       >
//                         Tu Perfil
//                       </Link>
//                       <button
//                         onClick={() => signOut()}
//                         className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition"
//                       >
//                         Cerrar Sesión
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Menú Móvil */}
//       {isMobileMenuOpen && (
//         <div
//           ref={mobileMenuRef}
//           className="md:hidden px-4 pb-6 bg-[#0f172a] border-b border-white/10"
//         >
//           <div className="space-y-2 mt-4 bg-white/5 rounded-2xl p-4 border border-white/10">
//             <Link
//               href="/"
//               className="block px-4 py-2 text-slate-300 hover:text-white"
//             >
//               Dashboard
//             </Link>
//             <Link
//               href="/contracts"
//               className="block px-4 py-2 text-slate-300 hover:text-white"
//             >
//               Contratos
//             </Link>
//             {session && (
//               <Link
//                 href="/contracts/add"
//                 className="block px-4 py-2 text-blue-400 font-bold"
//               >
//                 Nuevo Contrato
//               </Link>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;

"use client";
import { FaBell, FaFileContract, FaUserCircle, FaBars } from "react-icons/fa";

const NavbarPreview = () => {
  return (
    <nav className="bg-[#0f172a] h-20 fixed top-0 w-full z-50 flex items-center border-b border-white/10 px-8">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <FaFileContract className="text-white text-xl" />
          </div>
          <span className="text-white text-2xl font-bold tracking-tight">
            Contract<span className="text-blue-500">Advisor</span>
          </span>
        </div>

        {/* Links Desktop */}
        <div className="hidden md:flex bg-white/5 p-1 rounded-xl border border-white/5">
          <button className="bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium">
            Dashboard
          </button>
          <button className="text-slate-400 px-4 py-2 rounded-lg text-sm font-medium hover:text-white transition">
            Contratos
          </button>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-400 hover:text-white transition">
            <FaBell size={20} />
            <span className="absolute top-1 right-1 bg-red-500 w-2 h-2 rounded-full border-2 border-[#0f172a]"></span>
          </button>
          <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
            <FaUserCircle size={32} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarPreview;
