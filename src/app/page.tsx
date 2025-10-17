import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { Metadata } from "next";
import Layout from "@/components/Layout/Layout";
import { HeroBanner } from "@/components/HeroBanner";
import {
  AboutSection,
  MissionSection,
  FeaturedProductsSection,
  FeaturesSection,
  TestimonialsSection,
  ContactSection,
} from "@/components/sections";

const GET_STORE_CONFIG = gql`
  query GetStore($storeId: String!) {
    store(storeId: $storeId) {
      id
      storeId
      name
      primaryColor
      secondaryColor
      accentColor
      isActive
      maintenanceMode
      metaTitle
      metaDescription
      metaKeywords
      createdAt
      updatedAt
    }
  }
`;

export async function generateMetadata(): Promise<Metadata> {
  // Use default store ID or from environment variable
  const storeId = process.env.NEXT_PUBLIC_STORE_ID || "default-store";

  // Create a new Apollo Client instance for server-side data fetching
  const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "YOUR_GRAPHQL_ENDPOINT",
    cache: new InMemoryCache(),
  });

  try {
    // Fetch store data using Apollo Client query method
    const { data } = await client.query({
      query: GET_STORE_CONFIG,
      variables: { storeId },
    });

    const store = data?.store;

    return {
      title: store?.metaTitle || store?.name || "EmprendyUp Store",
      description:
        store?.metaDescription || "Dotaciones industriales de calidad",
      keywords: store?.metaKeywords,
      openGraph: {
        title: store?.metaTitle || store?.name,
        description: store?.metaDescription,
        images: [
          {
            url: "/assets/default-og-image.jpg",
            width: 1200,
            height: 630,
            alt: store?.name || "EmprendyUp Store",
          },
        ],
      },
    };
  } catch (error) {
    console.error("Error fetching store metadata:", error);

    // Return default metadata if fetch fails
    return {
      title: "EmprendyUp Store",
      description: "Dotaciones industriales de calidad",
    };
  }
}

export default function HomePage() {
  const imageA = "/assets/img2.png";
  const imageB = "/assets/img1.png";
  const imageC = "/assets/img3.png";
  const imageD = "/assets/img4.png";

  return (
    <Layout>
      <div className="space-y-12">
        <HeroBanner />
        <AboutSection imageA={imageA} imageB={imageB} />
        <MissionSection imageC={imageC} />
        <FeaturedProductsSection />
        <FeaturesSection />
        <TestimonialsSection />
        <ContactSection imageD={imageD} />
      </div>
    </Layout>
  );
}
