'use client';

import { useState } from 'react';
import {
  Save,
  Package,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Circle,
  Info,
  DollarSign,
  Image,
  Palette,
  Ruler,
  Tag,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { useStore } from '@/components/StoreProvider';
import { Product, CreateProductInput, ProductImage, ProductColor, ProductSize, ProductCategory } from '@/types/product';
import { ImageUploader } from './ImageUploader';
import { ColorPicker } from './ColorPicker';
import { SizeSelector } from './SizeSelector';
import { CategorySelector } from './CategorySelector';

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

interface ProductFormWizardProps {
  product?: Product;
  onSave: (productData: CreateProductInput) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

type StepType = 'basic' | 'pricing' | 'images' | 'variants' | 'categories' | 'review';

interface Step {
  id: StepType;
  title: string;
  description: string;
  icon: React.ReactNode;
  required: boolean;
}

export function ProductFormWizard({ product, onSave, onCancel, loading = false }: ProductFormWizardProps) {
  const { store } = useStore();
  const [currentStep, setCurrentStep] = useState<StepType>('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [completedSteps, setCompletedSteps] = useState<Set<StepType>>(new Set());

  // GraphQL mutation
  const [createProductWithUrls] = useMutation(CREATE_PRODUCT_WITH_URLS);

  // Define steps
  const steps: Step[] = [
    {
      id: 'basic',
      title: 'Información',
      description: 'Nombre, título y descripción del producto',
      icon: <Info className="w-5 h-5" />,
      required: true,
    },
    {
      id: 'pricing',
      title: 'Precio e Inventario',
      description: 'Precio, moneda y cantidad en stock',
      icon: <DollarSign className="w-5 h-5" />,
      required: true,
    },
    {
      id: 'images',
      title: 'Imágenes',
      description: 'Fotos del producto',
      icon: <Image className="w-5 h-5" />,
      required: true,
    },
    {
      id: 'variants',
      title: 'Variantes',
      description: 'Colores y tallas disponibles',
      icon: <Palette className="w-5 h-5" />,
      required: false,
    },
    {
      id: 'categories',
      title: 'Categorías',
      description: 'Clasificación del producto',
      icon: <Tag className="w-5 h-5" />,
      required: true,
    },
    {
      id: 'review',
      title: 'Revisar',
      description: 'Confirma todos los detalles',
      icon: <CheckCircle className="w-5 h-5" />,
      required: true,
    },
  ];

  // Form state
  const [formData, setFormData] = useState({
    name: product?.name || '',
    title: product?.title || '',
    description: product?.description || '',
    price: product?.price || 0,
    currency: product?.currency || 'COP',
    available: product?.available ?? true,
    inStock: product?.inStock ?? true,
    stock: product?.stock || 0,
  });
  const [images, setImages] = useState<ProductImage[]>(product?.images || []);
  const [colors, setColors] = useState<ProductColor[]>(product?.colors || []);
  const [sizes, setSizes] = useState<ProductSize[]>(product?.sizes || []);
  const [categories, setCategories] = useState<ProductCategory[]>(product?.categories || []);

  // Step validation
  const validateStep = (step: StepType): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 'basic':
        if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
        if (!formData.title.trim()) newErrors.title = 'El título es obligatorio';
        if (!formData.description.trim()) newErrors.description = 'La descripción es obligatoria';
        break;

      case 'pricing':
        if (formData.price <= 0) newErrors.price = 'El precio debe ser mayor a 0';
        break;

      case 'images':
        if (images.length === 0) newErrors.images = 'Agrega al menos una imagen';
        break;

      case 'categories':
        if (categories.length === 0) newErrors.categories = 'Selecciona una categoría';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if step is completed
  const isStepCompleted = (step: StepType): boolean => {
    switch (step) {
      case 'basic':
        return !!(formData.name.trim() && formData.title.trim() && formData.description.trim());
      case 'pricing':
        return formData.price > 0;
      case 'images':
        return images.length > 0;
      case 'variants':
        return true; // Optional step
      case 'categories':
        return categories.length > 0;
      case 'review':
        return true;
      default:
        return false;
    }
  };

  // Navigation
  const goToStep = (step: StepType) => {
    if (validateStep(currentStep)) {
      if (isStepCompleted(currentStep)) {
        setCompletedSteps(prev => new Set([...prev, currentStep]));
      }
      setCurrentStep(step);
    } else {
      // Show helpful message for incomplete steps
      const stepInfo = steps.find(s => s.id === currentStep);
      toast.error(`Por favor completa "${stepInfo?.title}" antes de continuar`);
    }
  };

  const nextStep = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex < steps.length - 1) {
      if (validateStep(currentStep)) {
        if (isStepCompleted(currentStep)) {
          setCompletedSteps(prev => new Set([...prev, currentStep]));
        }
        setCurrentStep(steps[currentIndex + 1].id);
      } else {
        // Show helpful validation message
        const stepInfo = steps.find(s => s.id === currentStep);
        toast.error(`Por favor completa todos los campos requeridos en "${stepInfo?.title}"`);
      }
    }
  };

  const prevStep = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  // Function to upload images to the server
  const uploadImages = async (imagesToUpload: ProductImage[]): Promise<ProductImage[]> => {
    if (imagesToUpload.length === 0) return [];

    setIsUploadingImages(true);
    toast.loading('Subiendo imágenes...', { id: 'image-upload' });

    const uploadedImages: ProductImage[] = [];

    try {
      for (const image of imagesToUpload) {
        // Skip images that already have URLs (already uploaded)
        if (image.url && !image.url.startsWith('blob:')) {
          uploadedImages.push(image);
          continue;
        }

        try {
          // Convert blob URL to file for upload
          const response = await fetch(image.url);
          const blob = await response.blob();

          const formData = new FormData();
          formData.append('images', blob, image.alt || 'product-image.jpg');
          // Add the business name as folder parameter (directly in uploads folder)
          if (store?.name) {
            formData.append('folderName', store.name.replace(/[^a-zA-Z0-9-_]/g, '_'));
          }

          const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/upload/images`, {
            method: 'POST',
            body: formData,
          });

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
            throw new Error('No URL returned from upload');
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          throw new Error(`Failed to upload image: ${image.alt || 'Unknown'}`);
        }
      }

      toast.success('Imágenes subidas exitosamente', { id: 'image-upload' });
      return uploadedImages;
    } catch (error) {
      toast.error('Error al subir imágenes', { id: 'image-upload' });
      throw error;
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleSubmit = async () => {
    if (!store?.storeId) return;

    // Validate all required steps
    const requiredSteps = steps.filter(s => s.required);
    for (const step of requiredSteps) {
      if (!validateStep(step.id)) {
        setCurrentStep(step.id);
        toast.error(`Por favor completa el paso: ${step.title}`);
        return;
      }
    }

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
        categories: categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
        })),
        images: uploadedImages.map(img => ({
          url: img.url,
        })),
        colors: colors.map(color => ({
          color: color.name,
          colorHex: color.hex,
        })),
        sizes: sizes.map(size => size.name),
        inStock: formData.inStock,
        stock: formData.stock,
      };

      // Create product using GraphQL mutation
      const { data } = await createProductWithUrls({
        variables: { input },
      });

      if (data.createProductWithUrls) {
        toast.success('¡Producto creado exitosamente! 🎉');
        // Reset form
        setFormData({
          name: '',
          title: '',
          description: '',
          price: 0,
          currency: 'COP',
          available: true,
          inStock: true,
          stock: 0,
        });
        setImages([]);
        setColors([]);
        setSizes([]);
        setCategories([]);
        setCompletedSteps(new Set());
        setCurrentStep('basic');
        onCancel(); // Close the form
      } else {
        throw new Error('No se pudo crear el producto');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar el producto';
      setErrors({ submit: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Info className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">Información Básica</h3>
              <p className="text-gray-600 mt-2">Cuéntanos sobre tu producto</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Producto *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="ej: Camiseta Polo Premium"
                />
                {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título del Producto *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => handleInputChange('title', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="ej: Camiseta Polo Premium de Algodón 100%"
                />
                {errors.title && <p className="text-red-500 text-sm mt-2">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={e => handleInputChange('description', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe las características, materiales, y beneficios de tu producto..."
                />
                {errors.description && <p className="text-red-500 text-sm mt-2">{errors.description}</p>}
              </div>
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <DollarSign className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">Precio e Inventario</h3>
              <p className="text-gray-600 mt-2">Define el precio y disponibilidad</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Precio *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={e => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.price && <p className="text-red-500 text-sm mt-2">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Moneda</label>
                <select
                  value={formData.currency}
                  onChange={e => handleInputChange('currency', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="COP">COP - Peso Colombiano</option>
                  <option value="USD">USD - Dólar Americano</option>
                  <option value="EUR">EUR - Euro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad en Stock</label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={e => handleInputChange('stock', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h4 className="font-medium text-gray-900 mb-4">Disponibilidad</h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={e => handleInputChange('available', e.target.checked)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">Producto disponible para la venta</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={e => handleInputChange('inStock', e.target.checked)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">Producto en stock</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 'images':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Image className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">Imágenes del Producto</h3>
              <p className="text-gray-600 mt-2">Sube fotos atractivas de tu producto</p>
            </div>

            <ImageUploader images={images} onChange={setImages} />
            {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}

            <div className="bg-blue-50 p-4 rounded-xl">
              <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Consejos para mejores fotos:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Usa buena iluminación natural</li>
                <li>• Incluye diferentes ángulos del producto</li>
                <li>• Muestra el producto en uso si es posible</li>
                <li>• Mantén el fondo limpio y simple</li>
              </ul>
            </div>
          </div>
        );

      case 'variants':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <Palette className="w-12 h-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">Variantes del Producto</h3>
              <p className="text-gray-600 mt-2">Agrega colores y tallas disponibles (opcional)</p>
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Palette className="w-5 h-5 mr-2" />
                  Colores
                </h4>
                <ColorPicker colors={colors} onChange={setColors} />
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Ruler className="w-5 h-5 mr-2" />
                  Tallas
                </h4>
                <SizeSelector sizes={sizes} onChange={setSizes} />
              </div>
            </div>
          </div>
        );

      case 'categories':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Tag className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">Categorías</h3>
              <p className="text-gray-600 mt-2">Clasifica tu producto para que sea fácil de encontrar</p>
            </div>

            <CategorySelector selectedCategories={categories} onChange={setCategories} />
            {errors.categories && <p className="text-red-500 text-sm">{errors.categories}</p>}
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">Revisar Producto</h3>
              <p className="text-gray-600 mt-2">Verifica que toda la información sea correcta</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {/* Product preview */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start space-x-4">
                  {images.length > 0 && (
                    <img src={images[0].url} alt={formData.name} className="w-20 h-20 object-cover rounded-lg" />
                  )}
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">{formData.name}</h4>
                    <p className="text-gray-600">{formData.title}</p>
                    <p className="text-2xl font-bold text-green-600 mt-2">
                      ${formData.price.toLocaleString()} {formData.currency}
                    </p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-6 space-y-4">
                <div>
                  <h5 className="font-medium text-gray-900">Descripción:</h5>
                  <p className="text-gray-600 text-sm mt-1">{formData.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-900">Stock:</h5>
                    <p className="text-gray-600 text-sm">{formData.stock} unidades</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Estado:</h5>
                    <p className="text-gray-600 text-sm">
                      {formData.available ? 'Disponible' : 'No disponible'} •{' '}
                      {formData.inStock ? 'En stock' : 'Sin stock'}
                    </p>
                  </div>
                </div>

                {categories.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-900">Categorías:</h5>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {categories.map(cat => (
                        <span key={cat.id} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {colors.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-900">Colores:</h5>
                    <div className="flex space-x-2 mt-1">
                      {colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded-full border border-gray-300"
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {sizes.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-900">Tallas:</h5>
                    <div className="flex space-x-2 mt-1">
                      {sizes.map((size, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded border">
                          {size.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="border-b bg-gradient-to-r from-blue-50 to-purple-50 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  {product ? 'Editar Producto' : 'Crear Nuevo Producto'}
                </h1>
                <p className="text-gray-600 mt-1 text-sm md:text-base">
                  Sigue los pasos para {product ? 'actualizar' : 'crear'} tu producto
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="px-3 md:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base"
            >
              <span className="hidden sm:inline">Cancelar</span>
              <span className="sm:hidden">✕</span>
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="p-4 md:p-6 border-b bg-gray-50">
          <div className="flex items-center justify-between overflow-x-auto items-start">
            {steps.map((step, index) => {
              const isActive = step.id === currentStep;
              const isCompleted = completedSteps.has(step.id) || isStepCompleted(step.id);
              const isClickable =
                index === 0 || completedSteps.has(steps[index - 1].id) || isStepCompleted(steps[index - 1].id);

              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center cursor-pointer group min-w-0 flex-1 ${
                    isClickable ? '' : 'cursor-not-allowed opacity-50'
                  }`}
                  onClick={() => isClickable && goToStep(step.id)}
                >
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      isActive
                        ? 'border-blue-500 bg-blue-500 text-white shadow-lg'
                        : isCompleted
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300 bg-white text-gray-400'
                    }`}
                  >
                    {isCompleted && !isActive ? (
                      <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
                    ) : (
                      <div className="w-4 h-4 md:w-5 md:h-5">{step.icon}</div>
                    )}
                  </div>
                  <div className="mt-2 text-center flex flex-col items-center">
                    <p
                      className={`text-xs md:text-sm font-medium ${
                        isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 hidden md:block max-w-16">{step.description}</p>
                  </div>

                  {/* Connection line */}
                  {index < steps.length - 1 && (
                    <div
                      className="hidden md:block absolute top-6 w-full h-0.5 bg-gray-200 -z-10"
                      style={{ left: '50%', width: 'calc(100% - 48px)' }}
                    >
                      <div
                        className={`h-full transition-all duration-300 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}
                        style={{ width: isCompleted ? '100%' : '0%' }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-4 md:p-8">
          <div className="transition-all duration-300 ease-in-out">{renderStep()}</div>
        </div>

        {/* Navigation */}
        <div className="border-t p-4 md:p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 'basic'}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Anterior</span>
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {steps.findIndex(s => s.id === currentStep) + 1} de {steps.length}
              </span>
            </div>

            <div className="flex space-x-3">
              {currentStep === 'review' ? (
                <button
                  onClick={handleSubmit}
                  disabled={loading || isSaving || isUploadingImages}
                  className="text-white px-6 md:px-8 py-2 md:py-3 rounded-lg disabled:opacity-50 flex items-center transition-all hover:shadow-lg"
                  style={{
                    backgroundColor: store?.primaryColor || '#2563eb',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = store?.secondaryColor || '#1e293b';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = store?.primaryColor || '#2563eb';
                  }}
                >
                  {loading || isSaving || isUploadingImages ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      <span className="hidden sm:inline">
                        {isUploadingImages ? 'Subiendo imágenes...' : product ? 'Actualizando...' : 'Creando...'}
                      </span>
                      <span className="sm:hidden">
                        {isUploadingImages ? 'Subiendo...' : product ? 'Actualizando...' : 'Creando...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">{product ? 'Actualizar' : 'Crear'} Producto</span>
                      <span className="sm:hidden">{product ? 'Actualizar' : 'Crear'}</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={steps.findIndex(s => s.id === currentStep) === steps.length - 1}
                  className="flex items-center px-4 md:px-6 py-2 text-white rounded-lg transition-colors hover:shadow-lg"
                  style={{
                    backgroundColor: store?.primaryColor || '#2563eb',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = store?.secondaryColor || '#1e293b';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = store?.primaryColor || '#2563eb';
                  }}
                >
                  <span className="hidden sm:inline">Siguiente</span>
                  <span className="sm:hidden">Sig.</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{errors.submit}</p>
        </div>
      )}
    </div>
  );
}
