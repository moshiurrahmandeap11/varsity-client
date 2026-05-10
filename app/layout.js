import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./contexts/AuthProvider";
import "./globals.css";
import TanStackProvider from "./components/sharedComponents/TanStackProvider/TanStackProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "ইসলামের ইতিহাস | আনন্দ মোহন ইউনিভার্সিটি কলেজ",
    template: "%s | ইসলামের ইতিহাস - আনন্দ মোহন ইউনিভার্সিটি কলেজ",
  },
  description:
    "আনন্দ মোহন ইউনিভার্সিটি কলেজের ইসলামের ইতিহাস বিভাগের অফিসিয়াল ডিজিটাল প্ল্যাটফর্ম। নোটিশ, রুটিন, সিলেবাস, একাডেমিক কার্যক্রম ও বিভাগের সকল তথ্য এক জায়গায়।",
  keywords: [
    "ইসলামের ইতিহাস",
    "ইসলামের ইতিহাস - আনন্দ মোহন ইউনিভার্সিটি কলেজ",
    "আনন্দ মোহন ইউনিভার্সিটি কলেজ",
    "Islamic History",
    "Islamic History - Ananda Mohan University College",
    "Ananda Mohan University College",
    "Department of Islamic History",
    "Mymensingh",
    "বিভাগীয় নোটিশ",
    "একাডেমিক নোটিশ",
    "রুটিন",
    "সিলেবাস",
  ],
  authors: [
    {
      name: "Moshiur Rahman Deap",
      url: "https://github.com/moshiurrahmandeap11",
    },
    { name: "ইসলামের ইতিহাস বিভাগ", url: "https://varsity-client.vercel.app" },
  ],
  creator: "Moshiur Rahman Deap",
  publisher: "আনন্দ মোহন ইউনিভার্সিটি কলেজ",
  applicationName: "ইসলামের ইতিহাস ডিজিটাল প্ল্যাটফর্ম",
  generator: "Next.js",
  metadataBase: new URL("https://varsity-client.vercel.app"),

  // Open Graph (Facebook, LinkedIn, etc.)
  openGraph: {
    type: "website",
    locale: "bn_BD",
    alternateLocale: "en_US",
    url: "https://varsity-client.vercel.app/",
    siteName: "ইসলামের ইতিহাস - আনন্দ মোহন ইউনিভার্সিটি কলেজ",
    title: "ইসলামের ইতিহাস | আনন্দ মোহন ইউনিভার্সিটি কলেজ",
    description:
      "আনন্দ মোহন ইউনিভার্সিটি কলেজের ইসলামের ইতিহাস বিভাগের অফিসিয়াল ডিজিটাল প্ল্যাটফর্ম। নোটিশ, রুটিন, সিলেবাস ও বিভাগের সকল তথ্য এখানে।",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ইসলামের ইতিহাস বিভাগ - আনন্দ মোহন ইউনিভার্সিটি কলেজ",
        type: "image/png",
      },
    ],
    countryName: "Bangladesh",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    site: "@islamer_itihas",
    creator: "@moshiur_rahman_deap",
    title: "ইসলামের ইতিহাস | আনন্দ মোহন ইউনিভার্সিটি কলেজ",
    description:
      "আনন্দ মোহন ইউনিভার্সিটি কলেজের ইসলামের ইতিহাস বিভাগের অফিসিয়াল ডিজিটাল প্ল্যাটফর্ম।",
    images: {
      url: "/og-image.png",
      alt: "ইসলামের ইতিহাস বিভাগ - আনন্দ মোহন ইউনিভার্সিটি কলেজ",
      width: 1200,
      height: 675,
    },
  },

  // Icons & Manifest
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16", type: "image/x-icon" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#667eea",
      },
    ],
  },

  manifest: "/manifest.json",

  // Robots & Search Engines
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification for Search Engines
  verification: {
    google: "google1ce609d1fdda7f2f",
  },

  // App Links
  appLinks: {
    web: {
      url: "https://varsity-client.vercel.app",
      should_fallback: true,
    },
  },

  // Category
  category: "education",

  // Classification
  classification: "Government College Department",

  // Content Rating
  rating: "general",

  // Distribution
  distribution: "global",

  // Language
  language: "bn",

  // Theme Color
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],

  // Color Scheme
  colorScheme: "dark light",

  // Viewport
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },

  // Referrer
  referrer: "origin-when-cross-origin",

  // Format Detection
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
    url: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <TanStackProvider>
            {children}{" "}
            <Toaster
              position="top-right"
              reverseOrder={false}
              toastOptions={{
                duration: 3000,
              }}
            />
          </TanStackProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
