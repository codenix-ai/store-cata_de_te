import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HeroBanner } from '@/components/HeroBanner/HeroBanner';
import { HeroSlider } from '@/components/HeroBanner/HeroSlider';
import { SiteHeroSlide } from '@/types/siteConfig';

// Mock the StoreProvider
jest.mock('@/components/StoreProvider', () => ({
  useStore: () => ({
    store: {
      primaryColor: '#3B82F6',
      secondaryColor: '#1E293B',
      textColor: '#FFFFFF',
    },
  }),
}));

// Mock Swiper components
jest.mock('swiper/react', () => ({
  Swiper: ({ children }: { children: React.ReactNode }) => <div data-testid="swiper">{children}</div>,
  SwiperSlide: ({ children }: { children: React.ReactNode }) => <div data-testid="swiper-slide">{children}</div>,
}));

jest.mock('swiper/modules', () => ({
  Autoplay: {},
  Pagination: {},
  Navigation: {},
  EffectFade: {},
}));

// Mock Next Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: { alt: string }) => <img alt={props.alt} />,
}));

describe('HeroBanner', () => {
  it('renders static banner when no slides are provided', () => {
    render(
      <HeroBanner
        title="Test Title"
        subtitle="Test Subtitle"
        buttonText="Test Button"
      />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('renders HeroSlider when slides are provided', () => {
    const slides: SiteHeroSlide[] = [
      {
        title: 'Slide 1',
        subtitle: 'Subtitle 1',
        backgroundImage: {
          id: '/test1.jpg',
          alt: 'Test 1',
        },
        buttons: [
          {
            text: 'Button 1',
            action: '/test',
            variant: 'primary',
          },
        ],
      },
      {
        title: 'Slide 2',
        subtitle: 'Subtitle 2',
        backgroundImage: {
          id: '/test2.jpg',
          alt: 'Test 2',
        },
      },
    ];

    render(<HeroBanner slides={slides} />);

    expect(screen.getByTestId('swiper')).toBeInTheDocument();
    expect(screen.getAllByTestId('swiper-slide')).toHaveLength(2);
  });
});

describe('HeroSlider', () => {
  const mockSlides: SiteHeroSlide[] = [
    {
      title: 'Welcome to our Store',
      subtitle: 'Find amazing products',
      backgroundImage: {
        id: '/assets/hero1.jpg',
        alt: 'Hero 1',
      },
      buttons: [
        {
          text: 'Shop Now',
          action: '/products',
          variant: 'primary',
        },
      ],
    },
    {
      title: 'Special Offers',
      subtitle: 'Save up to 50%',
      backgroundImage: {
        id: '/assets/hero2.jpg',
        alt: 'Hero 2',
      },
      buttons: [
        {
          text: 'View Deals',
          action: '#deals',
          variant: 'outline',
        },
      ],
    },
  ];

  it('renders slider with multiple slides', () => {
    render(<HeroSlider slides={mockSlides} />);

    expect(screen.getByTestId('swiper')).toBeInTheDocument();
    expect(screen.getAllByTestId('swiper-slide')).toHaveLength(2);
  });

  it('renders slide titles and subtitles', () => {
    render(<HeroSlider slides={mockSlides} />);

    expect(screen.getByText('Welcome to our Store')).toBeInTheDocument();
    expect(screen.getByText('Find amazing products')).toBeInTheDocument();
    expect(screen.getByText('Special Offers')).toBeInTheDocument();
    expect(screen.getByText('Save up to 50%')).toBeInTheDocument();
  });

  it('renders slide buttons', () => {
    render(<HeroSlider slides={mockSlides} />);

    expect(screen.getByText('Shop Now')).toBeInTheDocument();
    expect(screen.getByText('View Deals')).toBeInTheDocument();
  });

  it('renders slide images with correct alt text', () => {
    render(<HeroSlider slides={mockSlides} />);

    expect(screen.getByAltText('Hero 1')).toBeInTheDocument();
    expect(screen.getByAltText('Hero 2')).toBeInTheDocument();
  });
});
