import { Metadata } from "next";
import { gql } from "@apollo/client";
import { apolloClient } from "@/lib/apollo";

interface PageProps {
  params: Promise<{ id: string }>;
}

const GET_PRODUCT_QUERY = gql`
  query GetProduct($id: String!) {
    product(id: $id) {
      id
      title
      description
      price
      currency
      imageUrl
      available
      externalId
      createdAt
      updatedAt
      stock
      inStock
      colors {
        colorHex
        color
      }
      sizes {
        size
      }
      images {
        url
      }
      comments {
        id
        rating
        comment
        createdAt
      }
    }
  }
`;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const { data } = await apolloClient.query({
      query: GET_PRODUCT_QUERY,
      variables: { id: resolvedParams.id },
      errorPolicy: 'ignore',
      fetchPolicy: 'no-cache',
    });

    const product = data?.product;

    if (!product) {
      return {
        title: "Producto no encontrado | Pawis Colombia",
        description: "El producto que buscas no está disponible.",
      };
    }

    // Calculate average rating
    const averageRating = product.comments?.length > 0
      ? product.comments.reduce((sum: number, comment: any) => sum + comment.rating, 0) / product.comments.length
      : 0;

    // Generate keywords from product data
    const keywords = [
      product.title,
      "tejidos de punto",
      "confección colombia",
      "uniformes",
      "dotaciones",
      "textiles",
      ...(product.colors?.map((c: any) => `color ${c.color}`) || []),
      ...(product.sizes?.map((s: any) => `talla ${s.size}`) || []),
    ];

    // Image URL
    const imageUrl = product.images?.[0]?.url 
      ? `https://emprendyup-images.s3.us-east-1.amazonaws.com/${product.images[0].url}`
      : product.imageUrl || "/assets/default-product.jpg";

    const title = `${product.title} | Pawis Colombia`;
    const description = product.description 
      ? `${product.description.substring(0, 150)}... Precio: ${product.price} ${product.currency}. Confección de calidad en Colombia.`
      : `${product.title} - Producto de confección y tejido de punto. Precio: ${product.price} ${product.currency}. Calidad garantizada.`;

    return {
      title,
      description,
      keywords: keywords.join(", "),
      openGraph: {
        title,
        description,
        type: "website",
        url: `https://pawis.com.co/products/${resolvedParams.id}`,
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 600,
            alt: product.title,
          },
        ],
        siteName: "Pawis Colombia",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: `https://pawis.com.co/products/${resolvedParams.id}`,
      },
      robots: {
        index: product.available !== false,
        follow: true,
      },
      other: {
        "product:price:amount": product.price?.toString() || "0",
        "product:price:currency": product.currency || "COP",
        "product:availability": product.available ? "in stock" : "out of stock",
        "product:condition": "new",
        "product:brand": "Pawis Colombia",
        "product:category": "Textiles y Confección",
        ...(averageRating > 0 && {
          "product:rating": averageRating.toFixed(1),
          "product:rating:count": product.comments?.length?.toString() || "0",
        }),
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Producto | Pawis Colombia",
      description: "Productos de confección y tejido de punto de alta calidad en Colombia.",
    };
  }
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}