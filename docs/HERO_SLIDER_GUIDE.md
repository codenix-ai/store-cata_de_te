# Hero Slider Guide

This guide explains how to use the hero slider feature on your landing page.

## Overview

The hero slider allows you to display multiple slides with different images, titles, subtitles, and call-to-action buttons on your landing page. It's built using Swiper.js for smooth transitions and modern UX.

## Features

- **Multiple Slides**: Display multiple hero images with different content
- **Auto-play**: Automatically cycles through slides every 5 seconds
- **Navigation**: Next/Previous buttons and pagination dots
- **Fade Effect**: Smooth fade transitions between slides
- **Responsive**: Works perfectly on all screen sizes
- **Backward Compatible**: Falls back to static hero banner if no slides provided

## Configuration

### Single Static Hero (Default)

If you don't configure slides, the component will render a single static hero banner (backward compatible with existing setup):

```json
{
  "hero": {
    "title": "Your Store Title",
    "subtitle": "Your store subtitle",
    "backgroundImage": {
      "id": "/assets/hero-bg.jpg",
      "alt": "Hero background"
    },
    "buttons": [
      {
        "text": "Shop Now",
        "action": "/products",
        "variant": "primary"
      }
    ]
  }
}
```

### Multiple Slides (Hero Slider)

To enable the slider, add a `slides` array to your hero configuration:

```json
{
  "hero": {
    "slides": [
      {
        "title": "Welcome to Our Store",
        "subtitle": "Discover amazing products at great prices",
        "backgroundImage": {
          "id": "/assets/hero-slide-1.jpg",
          "alt": "Welcome slide"
        },
        "buttons": [
          {
            "text": "Shop Now",
            "action": "/products",
            "variant": "primary"
          }
        ]
      },
      {
        "title": "Summer Sale",
        "subtitle": "Save up to 50% on selected items",
        "backgroundImage": {
          "id": "/assets/hero-slide-2.jpg",
          "alt": "Summer sale"
        },
        "buttons": [
          {
            "text": "View Deals",
            "action": "#featured-products",
            "variant": "primary"
          },
          {
            "text": "Learn More",
            "action": "/about",
            "variant": "outline"
          }
        ]
      },
      {
        "title": "New Arrivals",
        "subtitle": "Check out our latest collection",
        "backgroundImage": {
          "id": "/assets/hero-slide-3.jpg",
          "alt": "New arrivals"
        },
        "buttons": [
          {
            "text": "Explore",
            "action": "/products?filter=new",
            "variant": "secondary"
          }
        ]
      }
    ]
  }
}
```

## Slide Configuration Options

### Per-Slide Properties

Each slide in the `slides` array can have:

- **title** (string, required): Main heading text
- **subtitle** (string, optional): Supporting text below the title
- **backgroundImage** (object, required):
  - **id** (string): Path to the image file
  - **alt** (string): Alt text for accessibility
- **buttons** (array, optional): Call-to-action buttons
  - **text** (string): Button label
  - **action** (string): URL path (e.g., "/products") or anchor (e.g., "#contact")
  - **variant** (string): Button style - "primary", "outline", or "secondary"

### Button Actions

Buttons support two types of actions:

1. **Page Navigation**: Use a path starting with "/" (e.g., "/products")
2. **Anchor Scroll**: Use an anchor starting with "#" (e.g., "#contact-form")

### Button Variants

- **primary**: Uses your store's primary color
- **outline**: Transparent with white border
- **secondary**: Uses your store's secondary color

## Slider Settings

The slider is configured with these default settings:

- **Auto-play**: 5 seconds per slide
- **Loop**: Continuous loop
- **Effect**: Fade transition
- **Navigation**: Arrow buttons on desktop
- **Pagination**: Dots indicator (clickable)

## Example: Complete Configuration

Here's a complete example for a fashion store:

```json
{
  "hero": {
    "slides": [
      {
        "title": "New Spring Collection",
        "subtitle": "Fresh styles for the new season",
        "backgroundImage": {
          "id": "/assets/spring-collection.jpg",
          "alt": "Spring fashion collection"
        },
        "buttons": [
          {
            "text": "Shop Collection",
            "action": "/products?collection=spring",
            "variant": "primary"
          }
        ]
      },
      {
        "title": "Limited Time Offer",
        "subtitle": "30% off all accessories",
        "backgroundImage": {
          "id": "/assets/accessories-sale.jpg",
          "alt": "Accessories sale"
        },
        "buttons": [
          {
            "text": "Shop Accessories",
            "action": "/products?category=accessories",
            "variant": "primary"
          },
          {
            "text": "View Terms",
            "action": "/terms",
            "variant": "outline"
          }
        ]
      },
      {
        "title": "Free Shipping",
        "subtitle": "On orders over $150,000 COP",
        "backgroundImage": {
          "id": "/assets/free-shipping.jpg",
          "alt": "Free shipping promotion"
        },
        "buttons": [
          {
            "text": "Start Shopping",
            "action": "/products",
            "variant": "primary"
          }
        ]
      }
    ]
  }
}
```

## Best Practices

1. **Image Size**: Use high-quality images (at least 1920x1080px) for best results
2. **Image Optimization**: Compress images using WebP format for faster loading
3. **Number of Slides**: 3-5 slides is optimal; too many can be overwhelming
4. **Text Length**: Keep titles short (under 50 characters) for better readability
5. **Contrast**: Ensure good contrast between text and background images
6. **Call-to-Action**: Each slide should have at least one clear button
7. **Consistency**: Maintain consistent styling across all slides

## Styling

The slider uses your store's primary color for:
- Active pagination dots
- Primary button background
- Gradient overlay

You can customize colors through your store configuration's `primaryColor`, `secondaryColor`, and `textColor` settings.

## Accessibility

The slider includes:
- Semantic HTML with proper heading hierarchy
- Alt text for all images
- Keyboard navigation support (arrow keys)
- Screen reader friendly pagination

## Technical Notes

- The slider uses Swiper.js v11.2.10
- First slide's image uses `priority` loading for better LCP
- Auto-play pauses on user interaction
- Fully responsive with mobile-optimized controls
