import { Poppins } from "next/font/google";
import "./globals.css";
import DoorTransitionLayout from "@/components/PageTransition";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-poppins",
});

export const metadata = {
  // Basic Meta Tags
  title: {
    default: "ANVITHA INFOTECH - Digital Innovation & Technology Solutions",
    template: "%s | ANVITHA INFOTECH",
  },
  description: "Transform your business with ANVITHA INFOTECH. Leading provider of web development, UI/UX design, digital strategy, and innovative software solutions. Custom CRM, automation tools, and cutting-edge digital experiences in Kerala, India.",
  
  keywords: [
    "web development",
    "UI/UX design",
    "digital transformation",
    "software development",
    "CRM solutions",
    "automation tools",
    "digital strategy",
    "enterprise solutions",
    "custom web applications",
    "React development",
    "Next.js development",
    "ANVITHA INFOTECH",
    "Kerala web development",
    "India software company"
  ],
  
  authors: [{ name: "ANVITHA INFOTECH" }],
  creator: "ANVITHA INFOTECH",
  publisher: "ANVITHA INFOTECH",
  
  // Open Graph Meta Tags (for social media sharing)
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ANVITHA INFOTECH",
    title: "ANVITHA INFOTECH - Digital Innovation & Technology Solutions",
    description: "Leading digital agency in Kerala specializing in web development, UI/UX design, and innovative business solutions. Transform your ideas into cutting-edge digital experiences.",
  },
  
  // Twitter Card Meta Tags
  twitter: {
    card: "summary_large_image",
    title: "ANVITHA INFOTECH - Digital Innovation & Web Development",
    description: "Transform your business with cutting-edge digital solutions. Expert web development, UI/UX design, and strategic consulting services in Kerala, India.",
  },
  
  // Robots Meta Tags
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // Icons and Favicons
  icons: {
    icon: "/favicon.ico",
  },
  
  // Theme Color
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  
  // Additional metadata
  category: "Technology",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        {/* Additional meta tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        
        {/* Structured Data - JSON-LD for better SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "ANVITHA INFOTECH",
              "description": "Leading digital agency specializing in web development, UI/UX design, and innovative business solutions.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Kakkanad, Kochi",
                "addressRegion": "Kerala",
                "addressCountry": "IN"
              },
              "serviceType": [
                "Web Development",
                "UI/UX Design",
                "Digital Strategy",
                "Software Development",
                "CRM Solutions"
              ]
            })
          }}
        />
      </head>
      <body className="antialiased">
        <DoorTransitionLayout>{children}</DoorTransitionLayout>
      </body>
    </html>
  );
}