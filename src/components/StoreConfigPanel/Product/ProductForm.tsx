"use client";

import { useState } from "react";
import { Save, Package } from "lucide-react";
import toast from "react-hot-toast";
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import { useStore } from "@/components/StoreProvider";
import {
  Product,
  CreateProductInput,
  ProductImage,
  ProductColor,
  ProductSize,
  ProductCategory,
} from "@/types/product";
import { ImageUploader } from "./ImageUploader";
import { ColorPicker } from "./ColorPicker";
import { SizeSelector } from "./SizeSelector";
import { CategorySelector } from "./CategorySelector";

// GraphQL Mutation
const CREATE_PRODUCT_WITH_URLS = gql`
  mutation CreateProductWithUrls($input: CreateProductWithUrlsInput!) {
    createProductWithUrls(input: $input) {
      id
      name
      description
      price
      inStock
      stock
      images {
        id
        url
      }
      categories {
        category {
          id
          name
        }
      }
      colors {
        id
        color
        colorHex
      }
      sizes {
        id
        size
      }
    }
  }
`;

interface ProductFormProps {
  product?: Product;
  onSave: (productData: CreateProductInput) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function ProductForm({
  product,
  onSave,
  onCancel,
  loading = false,
}: ProductFormProps) {
  const { store } = useStore();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // GraphQL mutation
  const [createProductWithUrls] = useMutation(CREATE_PRODUCT_WITH_URLS);

  // Form state
  const [formData, setFormData] = useState({
    name: product?.name || "",
    title: product?.title || "",
    description: product?.description || "",
    price: product?.price || 0,
    currency: product?.currency || "COP",
    available: product?.available ?? true,
    inStock: product?.inStock ?? true,
    stock: product?.stock || 0,
  });
  console.log("ProductForm - Initial formData:", store);
  const [images, setImages] = useState<ProductImage[]>(product?.images || []);
  const [colors, setColors] = useState<ProductColor[]>(product?.colors || []);
  const [sizes, setSizes] = useState<ProductSize[]>(product?.sizes || []);
  const [categories, setCategories] = useState<ProductCategory[]>(
    product?.categories || []
  );

  // Function to upload images to the server
  const uploadImages = async (
    imagesToUpload: ProductImage[]
  ): Promise<ProductImage[]> => {
    if (imagesToUpload.length === 0) return [];

    setIsUploadingImages(true);
    toast.loading("Subiendo imágenes...", { id: "image-upload" });

    const uploadedImages: ProductImage[] = [];

    try {
      for (const image of imagesToUpload) {
        // Skip images that already have URLs (already uploaded)
        if (image.url && !image.url.startsWith("blob:")) {
          uploadedImages.push(image);
          continue;
        }

        try {
          // Convert blob URL to file for upload
          const response = await fetch(image.url);
          const blob = await response.blob();

          const formData = new FormData();
          formData.append("images", blob, image.alt || "product-image.jpg");
          // Add the business name as folder parameter (directly in uploads folder)
          if (store?.name) {
            formData.append(
              "folderName",
              store.name.replace(/[^a-zA-Z0-9-_]/g, "_")
            );
          }

          const uploadResponse = await fetch(
            `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/upload/images`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (!uploadResponse.ok) {
            throw new Error(`Upload failed: ${uploadResponse.statusText}`);
          }

          const uploadResult = await uploadResponse.json();

          // Assuming the API returns { urls: ['url1', 'url2', ...] } or { url: 'single-url' }
          const uploadedUrl = uploadResult[0]?.key || uploadResult.url;

          if (uploadedUrl) {
            uploadedImages.push({
              ...image,
              url: uploadedUrl,
            });
          } else {
            throw new Error("No URL returned from upload");
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          throw new Error(`Failed to upload image: ${image.alt || "Unknown"}`);
        }
      }

      toast.success("Imágenes subidas exitosamente", { id: "image-upload" });
      return uploadedImages;
    } catch (error) {
      toast.error("Error al subir imágenes", { id: "image-upload" });
      throw error;
    } finally {
      setIsUploadingImages(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio";
    if (!formData.title.trim()) newErrors.title = "El título es obligatorio";
    if (!formData.description.trim())
      newErrors.description = "La descripción es obligatoria";
    if (formData.price <= 0) newErrors.price = "El precio debe ser mayor a 0";
    if (categories.length === 0)
      newErrors.categories = "Selecciona una categoría";
    if (images.length === 0) newErrors.images = "Agrega al menos una imagen";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!store?.storeId) return;

    const isLoading = loading || isSaving;
    if (isLoading) return;

    setIsSaving(true);
    try {
      // Upload images before saving the product
      const uploadedImages = await uploadImages(images);
      // Prepare the input for the GraphQL mutation
      const input = {
        name: formData.name,
        title: formData.title,
        description: formData.description,
        price: formData.price,
        currency: formData.currency,
        storeId: store.id,
        categories: categories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
        })),
        images: uploadedImages.map((img) => ({
          url: img.url,
        })),
        colors: colors.map((color) => ({
          color: color.name,
          colorHex: color.hex,
        })),
        sizes: sizes.map((size) => size.name), // Fix: Send array of strings instead of objects
        inStock: formData.inStock,
        stock: formData.stock,
      };

      // Create product using GraphQL mutation
      const { data } = await createProductWithUrls({
        variables: { input },
      });

      if (data.createProductWithUrls) {
        toast.success("Producto guardado exitosamente");
        // onSave(data.createProductWithUrls);
      } else {
        throw new Error("No se pudo crear el producto");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      // Set a more specific error message
      const errorMessage =
        error instanceof Error ? error.message : "Error al guardar el producto";
      setErrors({ submit: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Package className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-black">
                  {product ? "Editar Producto" : "Crear Nuevo Producto"}
                </h1>
                <p className="text-gray-600 mt-1">
                  {product
                    ? "Actualiza la información de tu producto"
                    : "Agrega un nuevo producto a tu tienda"}
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || isSaving || isUploadingImages}
                className=" text-white px-6 py-2 rounded-lg disabled:opacity-50 flex items-center"
                style={{
                  backgroundColor: store?.primaryColor || "#2563eb",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    store?.secondaryColor || "#1e293b";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    store?.primaryColor || "#2563eb";
                }}
              >
                {loading || isSaving || isUploadingImages ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {isUploadingImages
                      ? "Subiendo imágenes..."
                      : product
                      ? "Actualizando..."
                      : "Creando..."}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {product ? "Actualizar" : "Crear"} Producto
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Información Básica</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="ej: Camiseta Polo"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del Producto *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="ej: Camiseta Polo Premium de Algodón"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Describe las características, materiales, y beneficios de tu producto..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* Pricing and Stock */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Precio e Inventario</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    handleInputChange("price", parseFloat(e.target.value) || 0)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Moneda
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) =>
                    handleInputChange("currency", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="COP">COP - Peso Colombiano</option>
                  <option value="USD">USD - Dólar Americano</option>
                  <option value="EUR">EUR - Euro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad en Stock
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) =>
                    handleInputChange("stock", parseInt(e.target.value) || 0)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) =>
                    handleInputChange("available", e.target.checked)
                  }
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Producto disponible
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.inStock}
                  onChange={(e) =>
                    handleInputChange("inStock", e.target.checked)
                  }
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">En stock</span>
              </label>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Imágenes del Producto</h3>
            <ImageUploader images={images} onChange={setImages} />
            {errors.images && (
              <p className="text-red-500 text-sm">{errors.images}</p>
            )}
          </div>

          {/* Colors */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Colores</h3>
            <ColorPicker colors={colors} onChange={setColors} />
          </div>

          {/* Sizes */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Tallas</h3>
            <SizeSelector sizes={sizes} onChange={setSizes} />
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Categorías</h3>
            <CategorySelector
              selectedCategories={categories}
              onChange={setCategories}
            />
            {errors.categories && (
              <p className="text-red-500 text-sm">{errors.categories}</p>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
