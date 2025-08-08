# 🧱 Product Management Module – EmprendyUp Storefront

This module enables entrepreneurs to **create and manage products** from the frontend of the EmprendyUp platform using **Next.js**, **React**, **TypeScript**, and **Tailwind CSS**. It supports adding product details, images, colors, sizes, categories, and availability.

---

## 🛠️ Technologies

- **Next.js 15 (App Router)**
- **React + TypeScript**
- **Tailwind CSS**
- **GraphQL (Apollo Client)**
- **Form validation with React Hook Form + Zod**
- **Image upload (Cloudinary / UploadThing / S3)**

---

## 📋 Fields Managed

- `name`, `title`, `description`
- `price`, `currency`
- `available`, `inStock`, `stock`
- `images[]` (max 10)
- `colors[]` (with hex preview)
- `sizes[]`
- `categories[]` (select from existing)
- `comments[]` (read-only display in dashboard)

---

## 📁 Directory Structure

```
/app
  /dashboard
    /products
      page.tsx            # Product listing
      new/page.tsx        # Product creation form
      [id]/edit/page.tsx  # Product edit form
/components
  /ProductForm
  /ColorPicker
  /SizeSelector
  /ImageUploader
  /CategorySelector
/lib
  /graphql/mutations.ts
  /graphql/queries.ts
  /upload.ts
/types
  /product.ts
```

---

## ✅ Features

- Dynamic form for product creation
- Add multiple images with drag & drop ordering
- Real-time color preview from hex input
- Size selector (S, M, L, XL… or custom)
- Category selector (multi-select)
- Form validation with helpful UI feedback
- Success and error messages
- GraphQL mutations and cache update with Apollo
- Responsive design for mobile and desktop

---

## 🔐 Permissions

- Only authenticated users with a store ID can create/edit products
- Access control validated at GraphQL resolver level

---

## 💡 Example GraphQL Mutation

```graphql
mutation CreateProduct($input: CreateProductInput!) {
  createProduct(input: $input) {
    id
    name
    price
    images {
      url
    }
  }
}
```

---

## 📦 Installation Instructions

1. **Add Apollo Client if not installed**
```bash
npm install @apollo/client graphql
```

2. **Set up upload config**
   - Cloudinary, UploadThing or S3 bucket
   - Add `.env.local` keys

3. **Add product routes to App Router**

4. **Link module to user dashboard/menu**

---

## 🧪 Testing

- Form submission tests with Jest
- E2E with Playwright or Cypress (optional)

---

This module is designed to make product creation easy, intuitive, and robust for busy entrepreneurs.
