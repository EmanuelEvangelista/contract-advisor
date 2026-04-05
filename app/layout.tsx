import React from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import "@/assets/styles/globals.css";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Providers from "@/components/Providers";

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
        url: "https://contractadvisor.vercel.app/images/logo.png",
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
    <html lang="en">
      <body>
        <Providers>
          <NavBar />
          <main className="pt-20">{children}</main>
          <Footer />
          <ToastContainer />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
};

export default MainLayout;
