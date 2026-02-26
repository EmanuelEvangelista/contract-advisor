"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/logo.png";
// import profileDefault from "@/assets/images/profile.png";
import { FaGoogle, FaBars, FaBell } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";

const Navbar = () => {
  // const { data: session } = useSession();
  // // const profileImage = session?.user?.image || profileDefault;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  // const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
  // // const [providers, setProviders] = useState<Record<string, any>>(null);

  // const profileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const pathname: string = usePathname();

  // useEffect(() => {
  //   const setAuthProviders = async () => {
  //     const response = await getProviders();
  //     setProviders(response);
  //   };
  //   setAuthProviders();
  // }, []);

  // // 3. Efecto para cerrar al hacer clic fuera
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     // Cerrar menú de perfil
  //     if (
  //       profileMenuRef.current &&
  //       !profileMenuRef.current.contains(event.target as Node)
  //     ) {
  //       setIsProfileMenuOpen(false);
  //     }
  //     // Cerrar menú móvil
  //     if (
  //       mobileMenuRef.current &&
  //       !mobileMenuRef.current.contains(event.target as Node)
  //     ) {
  //       setIsMobileMenuOpen(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  // useEffect(() => {
  //   setIsMobileMenuOpen(false);
  //   setIsProfileMenuOpen(false);
  // }, [pathname]);

  return (
    <nav className="bg-white fixed top-0 left-0 w-full z-50 backdrop-blur-md shadow-lg shadow-indigo-500/20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative flex h-20 items-center">
          {/* Mobile button */}
          <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
            <button
              type="button"
              id="mobile-dropdown-button"
              className="inline-flex items-center justify-center rounded-lg p-2 text-white hover:bg-indigo-500/10 hover:text-indigo-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              <span className="sr-only">Open main menu</span>
              <FaBars className="h-6 w-6" />
            </button>
          </div>

          {/* Logo */}
          <div className="absolute left-12 md:left-0 flex items-center">
            <Link className="flex items-center space-x-3" href="/">
              <Image
                className="h-12 w-auto rounded-md"
                src={logo}
                alt="ContractAdviser"
                priority
              />
              <span className="text-gray-400 text-2xl font-semibold tracking-tight">
                Contract<span className="text-indigo-900">Advisor</span>
              </span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="w-full flex justify-center">
            <div className="hidden md:flex items-center space-x-16">
              <Link
                href="/"
                className={`${
                  pathname === "/" ? "text-indigo-900" : "text-slate-300"
                } text-base font-medium transition-all duration-200 hover:text-indigo-900`}
              >
                Home
              </Link>

              <Link
                href="/panel"
                className={`${
                  pathname === "/panel" ? "text-indigo-900" : "text-slate-300"
                } text-base font-medium transition-all duration-200 hover:text-indigo-900`}
              >
                My Panel
              </Link>

              <Link
                href="/contracts"
                className={`${
                  pathname === "/contracts"
                    ? "text-indigo-900"
                    : "text-slate-300"
                } text-base font-medium transition-all duration-200 hover:text-indigo-900`}
              >
                Contracts
              </Link>

              {/* {session && (
                <Link
                  href="/properties/add"
                  className={`${
                    pathname === "/properties/add"
                      ? "bg-pink-500 text-white"
                      : "text-pink-400"
                  } px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-pink-500 hover:text-white`}
                >
                  Add Property
                </Link>
              )} */}
            </div>
          </div>

          {/* Logged Out */}
          {/* {!session && (
            <div className="hidden md:block md:ml-6">
              <div className="flex items-center">
                {providers &&
                  Object.values(providers).map((provider, index) => (
                    <button
                      onClick={() => signIn(provider.id)}
                      key={index}
                      className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded-lg font-medium shadow-lg shadow-pink-500/20 transition-all duration-200"
                    >
                      <FaGoogle className="text-white" />
                      Login
                    </button>
                  ))}
              </div>
            </div>
          )} */}

          {/* Logged In */}
          {/* {session && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0 space-x-4">
              <Link href="/messages">
                <button
                  type="button"
                  className="relative rounded-lg bg-white/5 p-2 text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200"
                >
                  <UnreadMessageCount session={session} />
                  <FaBell className="h-5 w-5" />
                </button>
              </Link>

              <div className="relative">
                <button
                  type="button"
                  className="flex rounded-full ring-2 ring-purple-500/20 hover:ring-pink-500 transition-all duration-200"
                  id="user-menu-button"
                  onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                >
                  <Image
                    className="h-9 w-9 rounded-full"
                    src={profileImage}
                    alt="User Profile"
                    width={36}
                    height={36}
                  />
                </button>

                {isProfileMenuOpen && (
                  <div
                    ref={profileMenuRef}
                    className="absolute right-0 z-10 mt-3 w-52 rounded-xl bg-[#1e1b4b] border border-purple-500/20 shadow-2xl py-2"
                  >
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-slate-300 hover:bg-purple-500/10 hover:text-white transition"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Your Profile
                    </Link>

                    <Link
                      href="/properties/saved"
                      className="block px-4 py-2 text-sm text-slate-300 hover:bg-purple-500/10 hover:text-white transition"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Saved Properties
                    </Link>

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        signOut();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-pink-400 hover:bg-pink-500/10 transition"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          )} */}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          id="mobile-menu"
          className="md:hidden absolute top-20 left-1/2 -translate-x-1/2 w-[92%] max-w-sm"
        >
          <div className="space-y-3 mt-4 bg-indigo-600 rounded-2xl p-6 border border-indigo-500/20 shadow-2xl shadow-indigo-900/20">
            <Link
              href="/"
              className={`${
                pathname === "/"
                  ? "bg-indigo-100/20 text-white"
                  : "text-slate-300"
              } block text-center px-4 py-3 rounded-lg text-base font-medium transition hover:bg-gray-400/10`}
            >
              Home
            </Link>

            <Link
              href="/contracts"
              className={`${
                pathname === "/contracts"
                  ? "bg-indigo-100/20 text-white"
                  : "text-slate-300"
              } block text-center px-4 py-3 rounded-lg text-base font-medium transition hover:bg-gray-400/10`}
            >
              Contracts
            </Link>

            {/* {session && (
              <Link
                href="/properties/add"
                className="block text-center px-4 py-3 rounded-lg text-base font-medium text-pink-400 hover:bg-pink-500/10 transition"
              >
                Add Property
              </Link>
            )}

            {!session &&
              providers &&
              Object.values(providers).map((provider, index) => (
                <button
                  onClick={() => signIn(provider.id)}
                  key={index}
                  className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-medium w-full justify-center transition"
                >
                  <FaGoogle />
                  Login
                </button>
              ))} */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
