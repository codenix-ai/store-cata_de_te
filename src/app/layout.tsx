import type { Metadata } from "next";
import { Roboto, Montserrat } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar/Navbar";
import { Footer } from "@/components/Footer/Footer";
import { Toaster } from "react-hot-toast";
import CookieWrapper from "@/components/CookieWrapper";
import { WhatsAppWrapper } from "@/components/WhatsAppWrapper";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://pawis.com.co/#organization",
        name: "Pawis Colombia Tejidos de punto",
        url: "https://pawis.com.co",
        logo: {
          "@type": "ImageObject",
          url: "https://pawis.com.co/assets/logo.svg",
          width: 300,
          height: 100,
        },
        description:
          "Empresa líder en tejido de punto y confección textil en Colombia",
        address: {
          "@type": "PostalAddress",
          addressCountry: "CO",
          addressLocality: "Colombia",
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: "+57-320-4953448",
            contactType: "sales",
            areaServed: "CO",
            availableLanguage: "Spanish",
          },
          {
            "@type": "ContactPoint",
            telephone: "+57-320-4953448",
            contactType: "customer service",
            areaServed: "CO",
            availableLanguage: "Spanish",
          },
        ],
        sameAs: [
          "https://www.facebook.com/rossyssweaters",
          "https://www.instagram.com/tejisdospawis",
        ],
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://pawis.com.co/#localbusiness",
        name: "Pawis - Pawis Colombia Tejidos de punto",
        image: "https://pawis.com.co/assets/banner.webp",
        description:
          "Confección de uniformes, dotaciones y productos textiles al mayor y al detal",
        priceRange: "$$",
        servesCuisine: "Textil",
        address: {
          "@type": "PostalAddress",
          addressCountry: "CO",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "4.7110",
          longitude: "-74.0721",
        },
        url: "https://pawis.com.co",
        telephone: "+57-XXX-XXXXXXX",
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "08:00",
            closes: "18:00",
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://pawis.com.co/#website",
        url: "https://pawis.com.co",
        name: "Pawis Colombia Tejidos de punto",
        description:
          "Empresa de confección textil especializada en tejido de punto",
        publisher: {
          "@id": "https://pawis.com.co/#organization",
        },
        potentialAction: [
          {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate:
                "https://pawis.com.co/products?search={search_term_string}",
            },
            "query-input": "required name=search_term_string",
          },
        ],
        mainEntity: {
          "@type": "ItemList",
          "@id": "https://pawis.com.co/#sitelinks",
          name: "Navegación Principal",
          description: "Enlaces principales del sitio web",
          itemListElement: [
            {
              "@type": "SiteNavigationElement",
              "@id": "https://pawis.com.co/#nav-products",
              name: "Productos",
              description: "Catálogo completo de productos textiles",
              url: "https://pawis.com.co/products",
            },
            {
              "@type": "SiteNavigationElement",
              "@id": "https://pawis.com.co/#nav-uniformes",
              name: "Uniformes Empresariales",
              description: "Uniformes de alta calidad para empresas",
              url: "https://pawis.com.co/products?category=uniformes",
            },
            {
              "@type": "SiteNavigationElement",
              "@id": "https://pawis.com.co/#nav-dotaciones",
              name: "Dotaciones Laborales",
              description: "Dotaciones completas para trabajadores",
              url: "https://pawis.com.co/products?category=dotaciones",
            },
            {
              "@type": "SiteNavigationElement",
              "@id": "https://pawis.com.co/#nav-textiles",
              name: "Textiles de Punto",
              description: "Productos textiles especializados",
              url: "https://pawis.com.co/products?category=textiles",
            },
            {
              "@type": "SiteNavigationElement",
              "@id": "https://pawis.com.co/#nav-contact",
              name: "Contacto y Soporte",
              description: "Información de contacto y atención al cliente",
              url: "https://pawis.com.co/support",
            },
            {
              "@type": "SiteNavigationElement",
              "@id": "https://pawis.com.co/#nav-account",
              name: "Mi Cuenta",
              description: "Gestión de perfil y pedidos",
              url: "https://pawis.com.co/perfil",
            },
          ],
        },
      },
      {
        "@type": "ItemList",
        "@id": "https://pawis.com.co/#products",
        name: "Productos de Confección",
        description: "Catálogo de productos textiles y confección",
        itemListElement: [
          {
            "@type": "Product",
            name: "Uniformes Empresariales",
            description: "Uniformes de alta calidad para empresas",
            category: "Textiles",
          },
          {
            "@type": "Product",
            name: "Dotaciones Laborales",
            description: "Dotaciones completas para trabajadores",
            category: "Textiles",
          },
          {
            "@type": "Product",
            name: "Camisetas Personalizadas",
            description: "Camisetas con diseños personalizados",
            category: "Textiles",
          },
        ],
      },
    ],
  };

  // Additional structured data specifically for sitelinks
  const sitelinksData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": "https://pawis.com.co/#breadcrumbs",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: "https://pawis.com.co",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Productos",
        item: "https://pawis.com.co/products",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Uniformes Empresariales",
        item: "https://pawis.com.co/products?category=uniformes",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Dotaciones Laborales",
        item: "https://pawis.com.co/products?category=dotaciones",
      },
      {
        "@type": "ListItem",
        position: 5,
        name: "Soporte",
        item: "https://pawis.com.co/support",
      },
    ],
  };

  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(sitelinksData) }}
        />
        <meta name="geo.region" content="CO" />
        <meta name="geo.placename" content="Colombia" />
        <meta name="ICBM" content="4.7110, -74.0721" />
        <meta name="business.contact_data.country" content="Colombia" />
        <meta name="business.contact_data.region" content="Cundinamarca" />
      </head>
      <body
        className={`${roboto.variable} ${montserrat.variable} font-roboto antialiased min-h-screen flex flex-col text-gray-900 bg-white dark:text-gray-100 dark:bg-slate-900`}
      >
        <Providers>
          <Toaster position="bottom-right" toastOptions={{ duration: 3400 }} />
          {/* <Navbar /> */}
          <main className="flex-1">{children}</main>
          <WhatsAppWrapper />
          {/* <Footer /> */}
          <CookieWrapper />
        </Providers>
      </body>
    </html>
  );
}
