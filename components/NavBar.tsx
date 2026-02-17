"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/logo-nestrly.png";
import profileDefault from "@/assets/images/profile.png";
import { FaGoogle, FaBars, FaBell } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import UnreadMessageCount from "@/components/UnreadMessageCount";

const Navbar = () => {
  const { data: session } = useSession();
  const profileImage = session?.user?.image || profileDefault;

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
    <nav className="bg-[#0f172a] border-b border-white/10 backdrop-blur-md fixed top-0 left-0 w-full z-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative flex h-20 items-center justify-between">
          {/* Mobile button */}
          <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
            <button
              type="button"
              id="mobile-dropdown-button"
              className="inline-flex items-center justify-center rounded-xl p-2 text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              <span className="sr-only">Open main menu</span>
              <FaBars className="h-6 w-6" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            <Link className="flex items-center space-x-3" href="/">
              <Image
                className="h-12 w-auto"
                src={logo}
                alt="Nestrly"
                priority
              />
              <span className="hidden md:block text-white text-2xl font-semibold tracking-wide">
                Nestrly
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:ml-10 md:flex items-center">
              <div className="flex space-x-1 bg-white/5 p-1 rounded-xl">
                <Link
                  href="/"
                  className={`${
                    pathname === "/"
                      ? "bg-white/10 text-white"
                      : "text-slate-300"
                  } px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10 hover:text-white`}
                >
                  Home
                </Link>

                <Link
                  href="/properties"
                  className={`${
                    pathname === "/properties"
                      ? "bg-white/10 text-white"
                      : "text-slate-300"
                  } px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10 hover:text-white`}
                >
                  Properties
                </Link>

                {session && (
                  <Link
                    href="/properties/add"
                    className={`${
                      pathname === "/properties/add"
                        ? "bg-orange-500 text-white"
                        : "text-orange-400"
                    } px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-orange-500 hover:text-white`}
                  >
                    Add Property
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Logged Out */}
          {!session && (
            <div className="hidden md:block md:ml-6">
              <div className="flex items-center">
                {providers &&
                  Object.values(providers).map((provider, index) => (
                    <button
                      onClick={() => signIn(provider.id)}
                      key={index}
                      className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl font-medium shadow-lg shadow-orange-500/20 transition-all duration-200"
                    >
                      <FaGoogle className="text-white" />
                      Login
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Logged In */}
          {session && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0 space-x-4">
              <Link href="/messages">
                <button
                  type="button"
                  className="relative rounded-xl bg-white/5 p-2 text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200"
                >
                  <UnreadMessageCount session={session} />
                  <FaBell className="h-5 w-5" />
                </button>
              </Link>

              <div className="relative">
                <button
                  type="button"
                  className="flex rounded-full ring-2 ring-white/10 hover:ring-orange-500 transition-all duration-200"
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
                    className="absolute right-0 z-10 mt-3 w-52 rounded-xl bg-[#111827] border border-white/10 shadow-2xl py-2"
                  >
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Your Profile
                    </Link>

                    <Link
                      href="/properties/saved"
                      className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Saved Properties
                    </Link>

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        signOut();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition"
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          id="mobile-menu"
          className="md:hidden px-4 pb-6"
        >
          <div className="space-y-2 mt-4 bg-white/5 rounded-2xl p-4 border border-white/10">
            <Link
              href="/"
              className={`${
                pathname === "/" ? "bg-white/10 text-white" : "text-slate-300"
              } block px-4 py-2 rounded-lg text-sm font-medium transition hover:bg-white/10`}
            >
              Home
            </Link>

            <Link
              href="/properties"
              className={`${
                pathname === "/properties"
                  ? "bg-white/10 text-white"
                  : "text-slate-300"
              } block px-4 py-2 rounded-lg text-sm font-medium transition hover:bg-white/10`}
            >
              Properties
            </Link>

            {session && (
              <Link
                href="/properties/add"
                className="block px-4 py-2 rounded-lg text-sm font-medium text-orange-400 hover:bg-orange-500 hover:text-white transition"
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
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-medium w-full justify-center transition"
                >
                  <FaGoogle />
                  Login
                </button>
              ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
