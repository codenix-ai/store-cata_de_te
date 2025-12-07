import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { SiteConfig } from '@/types/siteConfig';

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
      siteConfig
    }
  }
`;

export async function getStoreData(storeId: string) {
  const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'YOUR_GRAPHQL_ENDPOINT',
    cache: new InMemoryCache(),
  });

  try {
    const { data } = await client.query({
      query: GET_STORE_CONFIG,
      variables: { storeId },
    });

    const store = data?.store;
    let siteConfig: SiteConfig | null = null;

    // Parse siteConfig if it exists
    if (store?.siteConfig) {
      try {
        siteConfig = typeof store.siteConfig === 'string' ? JSON.parse(store.siteConfig) : store.siteConfig;
      } catch (error) {
        console.error('Error parsing siteConfig:', error);
      }
    }

    return { store, siteConfig };
  } catch (error) {
    console.error('Error fetching store data:', error);
    
    // Return mock data with hero slider configuration for development/demo
    const mockSiteConfig: SiteConfig = {
      branding: {
        name: 'Cata de Té',
        tagline: 'Descubre el mundo del té',
        description: 'Tés premium e infusiones naturales',
      },
      theme: {
        colors: {
          primary: '#8B4513',
          primaryDark: '#654321',
          primaryLight: '#A0522D',
          secondary: '#F5DEB3',
          accent: '#D2691E',
          background: '#FFFFFF',
          text: '#333333',
        },
        fonts: {
          heading: 'Montserrat, sans-serif',
          body: 'Roboto, sans-serif',
        },
      },
      hero: {
        title: 'Bienvenido a Cata de Té',
        subtitle: 'Descubre el mundo del té y las infusiones naturales',
        // Example with slider - comment out to test single hero
        slides: [
          {
            title: 'Bienvenido a Cata de Té',
            subtitle: 'Descubre el mundo del té y las infusiones naturales',
            backgroundImage: {
              id: '/assets/bannercata.webp',
              alt: 'Cata de té principal',
            },
            buttons: [
              {
                text: 'Ver Productos',
                action: '/products',
                variant: 'primary',
              },
              {
                text: 'Solicitar Cotización',
                action: '#contact-form',
                variant: 'outline',
              },
            ],
          },
          {
            title: 'Calidad Premium',
            subtitle: 'Tés de hebras y blends exclusivos importados directamente',
            backgroundImage: {
              id: '/assets/img1.webp',
              alt: 'Productos de té premium',
            },
            buttons: [
              {
                text: 'Explorar Catálogo',
                action: '/products',
                variant: 'primary',
              },
            ],
          },
          {
            title: 'Experiencia Única',
            subtitle: 'Infusiones naturales para cada momento del día',
            backgroundImage: {
              id: '/assets/img2.webp',
              alt: 'Momento de té',
            },
            buttons: [
              {
                text: 'Conocer Más',
                action: '#about',
                variant: 'primary',
              },
            ],
          },
        ],
      },
      about: {
        title: 'Sobre Nosotros',
        paragraphs: [
          'Somos especialistas en té premium e infusiones naturales.',
        ],
      },
      menu: {
        title: 'Nuestros Productos',
        items: [],
      },
      gallery: {
        title: 'Galería',
        images: [],
      },
      testimonials: {
        title: 'Testimonios',
        items: [],
      },
      contact: {
        title: 'Contacto',
      },
      navigation: {
        items: [
          { label: 'Inicio', href: '/' },
          { label: 'Productos', href: '/products' },
          { label: 'Contacto', href: '#contact-form' },
        ],
      },
      footer: {
        copyrightText: '© 2024 Cata de Té',
      },
      reservationForm: {
        title: 'Contacto',
        fields: {
          name: { label: 'Nombre' },
          email: { label: 'Email' },
          phone: { label: 'Teléfono' },
          date: { label: 'Fecha' },
          time: { label: 'Hora' },
          partySize: { label: 'Personas' },
        },
        submitButton: 'Enviar',
      },
      seo: {
        title: 'Cata de Té - Tés Premium e Infusiones',
        description: 'Descubre nuestra selección de tés premium e infusiones naturales',
      },
    };

    return { 
      store: null, 
      siteConfig: mockSiteConfig,
    };
  }
}
