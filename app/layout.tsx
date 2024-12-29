import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/assets/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GlobalProvider } from "@/context/GlobalContext";
import "photoswipe/dist/photoswipe.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RapidRent | Find the perfect rental in no time",
  description: "Find your dream rental property",
  keywords: "rental, find rentals, find properties",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/favicon.svg", type: "image/svg+xml"},
    ],
    other: [
      {
        rel: "shortcut icon",
        url: "/favicon.ico",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        url: "/apple-touch-icon.png",
      },
    ],
  },
  manifest: "/site.webmanifest",

};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GlobalProvider>
      <AuthProvider>
        <html lang="en" className="dark" suppressHydrationWarning>
          <body className="dark:bg-[#161c20]">
            <Providers>
              <Navbar />
              <main>{children}</main>
              <Footer />
              <ToastContainer />
            </Providers>
          </body>
        </html>
      </AuthProvider>
    </GlobalProvider>
  );
}
