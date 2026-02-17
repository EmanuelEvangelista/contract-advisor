import React from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import "@/assets/styles/globals.css";
import { Metadata } from "next";
// import AuthProvider from "@/components/AuthProvider";
import { ToastContainer } from "react-toastify";
// import { GlobalProvider } from "@/context/GlobalContext";
import "react-toastify/dist/ReactToastify.css";
import "@/assets/styles/globals.css";

export const metadata: Metadata = {
  title: "Contract Advisor | Professional Contract Management",
  description:
    "Comprehensive lifecycle management for accountants. Track expirations, automate PDF generation, and manage client relations with data-driven insights.",
  keywords: [
    "contract management",
    "accounting software",
    "expiration tracking",
    "legal tech",
    "document automation",
    "SaaS for accountants",
  ],
  authors: [{ name: "Emanuel Evangelista" }],
  openGraph: {
    title: "Contract Advisor - Secure Contract Lifecycle Management",
    description:
      "Never miss a deadline. Streamline your accounting firm's legal workflow.",
    type: "website",
    images: [
      {
        url: "/og-dashboard.png",
        width: 1200,
        height: 630,
        alt: "Contract Advisor Dashboard Preview",
      },
    ],
  },
};

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    // <GlobalProvider>
    //   <AuthProvider>
    <html lang="en">
      <body>
        <NavBar />
        <main>{children}</main>
        <Footer />
        {/* <ToastContainer /> */}
      </body>
    </html>
    //   </AuthProvider>
    // </GlobalProvider>
  );
};

export default MainLayout;
