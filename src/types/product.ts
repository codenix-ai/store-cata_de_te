export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  order: number;
}

export interface ProductColor {
  id: string;
  name: string;
  hex: string;
}

export interface ProductSize {
  id: string;
  name: string;
  value: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ProductComment {
  id: string;
  content: string;
  rating: number;
  author: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  available: boolean;
  inStock: boolean;
  stock: number;
  images: ProductImage[];
  colors: ProductColor[];
  sizes: ProductSize[];
  categories: ProductCategory[];
  comments: ProductComment[];
  storeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  available: boolean;
  inStock: boolean;
  stock: number;
  images: Omit<ProductImage, 'id'>[];
  colors: Omit<ProductColor, 'id'>[];
  sizes: Omit<ProductSize, 'id'>[];
  categoryIds: string[];
  storeId: string;
}
