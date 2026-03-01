"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/logo.png";
import profileDefault from "@/assets/images/profile.png";
import { FaGoogle, FaBars, FaBell } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import InviteCode from "./InviteCode";

const Navbar = () => {
  const { data: session } = useSession();
  const profileImage = session?.user?.image || profileDefault;
  const role = session?.user.role;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
  const [providers, setProviders] = useState<Record<string, any>>(null);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const pathname: string = usePathname();

  useEffect(() => {
    const setAuthProviders = async () => {
      const response = await getProviders();
      setProviders(response);
    };
    setAuthProviders();
  }, []);

  // 3. Efecto para cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Cerrar menú de perfil
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
      // Cerrar menú móvil
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="bg-white fixed top-0 left-0 w-full z-50 backdrop-blur-md shadow-lg shadow-indigo-500/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-20 items-center justify-between">
          {/* 1. LADO IZQUIERDO: Logo y Nombre */}
          <div className="flex items-center flex-shrink-0">
            {/* Mobile button - Ahora integrado en el flujo */}
            <button
              type="button"
              className="md:hidden mr-4 p-2 text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              <FaBars className="h-6 w-6" />
            </button>

            <Link className="flex items-center space-x-3" href="/">
              <Image
                className="h-10 w-auto rounded-md" // Reducido un poco para dar aire
                src={logo}
                alt="ContractAdviser"
                priority
              />
              <span className="hidden sm:block text-slate-400 text-xl font-semibold tracking-tight">
                Contract<span className="text-indigo-900">Advisor</span>
              </span>
            </Link>
          </div>

          {/* 2. CENTRO: Navegación (Solo Desktop) */}
          <div className="hidden md:flex flex-1 justify-center px-4">
            <div className="flex items-center space-x-4 lg:space-x-8">
              {" "}
              {/* Espaciado adaptativo */}
              {!session && (
                <Link
                  href="/"
                  className={`${pathname === "/" ? "text-indigo-900 border-b-2 border-indigo-900" : "text-slate-400 hover:text-indigo-900"} 
                pb-1 text-sm lg:text-base font-medium transition-all`}
                >
                  Home
                </Link>
              )}
              <Link
                href="/panel"
                className={`${pathname === "/panel" ? "text-indigo-900 border-b-2 border-indigo-900" : "text-slate-400 hover:text-indigo-900"} 
                pb-1 text-sm lg:text-base font-medium transition-all`}
              >
                My Panel
              </Link>
              <Link
                href="/contracts"
                className={`${pathname === "/contracts" ? "text-indigo-900 border-b-2 border-indigo-900" : "text-slate-400 hover:text-indigo-900"} 
                pb-1 text-sm lg:text-base font-medium transition-all`}
              >
                Contracts
              </Link>
              {session && (
                <Link
                  href="/contracts/add"
                  className={`${
                    pathname === "/contracts/add"
                      ? "bg-indigo-500 text-white"
                      : "text-indigo-500 border border-indigo-200 hover:bg-indigo-50"
                  } px-3 py-1.5 rounded-lg text-xs lg:text-sm font-bold transition-all whitespace-nowrap`}
                >
                  + Add Contract
                </Link>
              )}
            </div>
          </div>

          {/* 3. LADO DERECHO: Invite Code & Perfil */}
          <div className="flex items-center space-x-3 lg:space-x-6 flex-shrink-0">
            {/* Invite Code - Solo Desktop y solo para Accountants */}
            {role === "accountant" && (
              <div className="hidden lg:block">
                <InviteCode session={session} />
              </div>
            )}

            {!session ? (
              <div className="flex items-center">
                {providers &&
                  Object.values(providers).map((provider, index) => (
                    <button
                      key={index}
                      onClick={() => signIn(provider.id)}
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md transition-all"
                    >
                      <FaGoogle />
                      <span className="hidden sm:inline">Login</span>
                    </button>
                  ))}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                {/* Profile Dropdown */}
                <div className="relative" ref={profileMenuRef}>
                  <button
                    type="button"
                    className="flex rounded-full ring-2 ring-indigo-100 hover:ring-indigo-500 transition-all overflow-hidden"
                    onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                  >
                    <Image
                      className="h-10 w-10 rounded-full object-cover"
                      src={profileImage}
                      alt="User Profile"
                      width={40}
                      height={40}
                    />
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 z-10 mt-3 w-48 rounded-2xl bg-white border border-slate-100 shadow-xl py-2 overflow-hidden">
                      <div className="px-4 py-2 border-b border-slate-50">
                        <p className="text-xs text-slate-400 truncate">
                          {session.user?.email}
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 transition"
                      >
                        Your Profile
                      </Link>
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="block w-full text-left px-4 py-2 text-sm text-pink-600 hover:bg-pink-50 transition font-medium"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu ... (mismo código que ya tenías) */}
    </nav>
  );
};

export default Navbar;
