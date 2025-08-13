"use client";

import { useState } from "react";
import {
  Plus,
  Package,
  Search,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Product, CreateProductInput } from "@/types/product";
import { ProductForm } from "./Product/ProductForm";
import { TabProps } from "./types";
import toast from "react-hot-toast";
import { useStore } from "../StoreProvider";

// GraphQL Queries and Mutations
const GET_PRODUCTS_BY_STORE = gql`
  query GetProductsByStore($storeId: String!, $page: Int, $pageSize: Int) {
    productsByStore(storeId: $storeId, page: $page, pageSize: $pageSize) {
      items {
        id
        name
        title
        price
        currency
        available
        inStock
        stock
        images {
          id
          url
          order
        }
        colors {
          id
          color
          colorHex
        }
        categories {
          category {
            id
            name
            slug
          }
        }
      }
      total
      page
      pageSize
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: String!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      title
      description
      price
      currency
      available
      inStock
      stock
      storeId
      images {
        id
        url
        order
      }
      colors {
        id
        name
        hex
      }
      sizes {
        id
        name
        value
      }
      categories {
        id
        name
        slug
      }
      createdAt
      updatedAt
    }
  }
`;

const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      title
      description
      price
      currency
      available
      inStock
      stock
      storeId
      externalId
      images {
        id
        url
        order
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
      categories {
        id
        name
        slug
      }
      createdAt
      updatedAt
    }
  }
`;

export function ProductsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const { store } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // GraphQL hooks
  const storeId = (store && store.id) || "default-store";
  const {
    data: productsData,
    loading: loadingProducts,
    refetch: refetchProducts,
  } = useQuery(GET_PRODUCTS_BY_STORE, {
    variables: { storeId, page: currentPage, pageSize },
    skip: !storeId,
  });
  const [createProduct, { loading: creating }] = useMutation(CREATE_PRODUCT);
  const [updateProduct, { loading: updating }] = useMutation(UPDATE_PRODUCT);

  if (!productsData) {
    return null;
  }

  // Use data from GraphQL
  const products: Product[] = productsData?.productsByStore.items || [];
  const totalProducts = productsData?.productsByStore.total || 0;
  const totalPages = Math.ceil(totalProducts / pageSize);

  const filteredProducts = products.filter(
    (product: Product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedProducts([]); // Clear selections when changing pages
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
    setSelectedProducts([]);
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSaveProduct = async (productData: CreateProductInput) => {
    try {
      if (editingProduct) {
        // Update existing product using GraphQL mutation
        const { data } = await updateProduct({
          variables: {
            id: editingProduct.id,
            input: {
              name: productData.name,
              title: productData.title,
              description: productData.description,
              price: productData.price,
              currency: productData.currency,
              available: productData.available,
              inStock: productData.inStock,
              stock: productData.stock,
              categories: productData.categoryIds || [],
              images: productData.images.map((img) => ({
                url: img.url,
                order: img.order,
              })),
              colors: productData.colors.map((color) => ({
                name: color.name,
                hex: color.hex,
              })),
              sizes: productData.sizes.map((size) => ({
                name: size.name,
                value: size.value,
              })),
            },
          },
        });

        if (data?.updateProduct) {
          // Refetch products to get updated list with current pagination
          await refetchProducts({
            storeId,
            page: currentPage,
            pageSize,
          });
          toast.success("Producto actualizado exitosamente");
        }
      } else {
        // Create new product using GraphQL mutation
        const { data } = await createProduct({
          variables: {
            input: {
              name: productData.name,
              title: productData.title,
              description: productData.description,
              price: productData.price,
              currency: productData.currency,
              available: productData.available,
              inStock: productData.inStock,
              stock: productData.stock,
              storeId: (store && store.id) || "default-store",
              categories: productData.categoryIds || [],
              images: productData.images.map((img) => ({
                url: img.url,
                order: img.order,
              })),
              colors: productData.colors.map((color) => ({
                name: color.name,
                hex: color.hex,
              })),
              sizes: productData.sizes.map((size) => ({
                name: size.name,
                value: size.value,
              })),
            },
          },
        });

        if (data?.createProduct) {
          // Refetch products to get updated list with current pagination
          await refetchProducts({
            storeId,
            page: currentPage,
            pageSize,
          });
          toast.success("Producto creado exitosamente");
        }
      }
      setShowForm(false);
      setEditingProduct(null);
    } catch (error: any) {
      console.error("Error saving product:", error);
      const errorMessage = error.message || "Error al guardar el producto";
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleDeleteProduct = (productId: string) => {
    // TODO: Implement DELETE_PRODUCT mutation
    toast.error("Eliminación de productos aún no implementada");
  };

  const handleDeleteSelected = () => {
    // TODO: Implement DELETE_PRODUCTS mutation
    toast.error("Eliminación masiva de productos aún no implementada");
    console.log("Delete products:", selectedProducts);
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedProducts((prev) =>
      prev.length === filteredProducts.length
        ? []
        : filteredProducts.map((p: Product) => p.id)
    );
  };

  if (showForm) {
    return (
      <ProductForm
        product={editingProduct || undefined}
        onSave={handleSaveProduct}
        onCancel={() => {
          setShowForm(false);
          setEditingProduct(null);
        }}
        loading={creating || updating}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Gestión de Productos</h3>
          <p className="text-sm text-gray-600">
            Administra el catálogo de productos de tu tienda
          </p>
        </div>
        <button
          onClick={handleCreateProduct}
          className="text-white px-4 py-2 rounded-lg flex items-center"
          style={{ backgroundColor: store?.primaryColor || "#2563eb" }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Producto
        </button>
      </div>

      {/* Search and Actions */}
      <div className="flex items-center justify-between space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {selectedProducts.length > 0 && (
          <button
            onClick={handleDeleteSelected}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar ({selectedProducts.length})
          </button>
        )}
      </div>

      {/* Products Table */}
      {loadingProducts ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Cargando productos...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedProducts.length === filteredProducts.length &&
                        filteredProducts.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product: Product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleProductSelection(product.id)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10">
                          {product.images.length > 0 ? (
                            <>
                              <img
                                src={`https://emprendyup-images.s3.us-east-1.amazonaws.com/${product.images[0].url}`}
                                alt={product.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            </>
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Package className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ${product.price.toLocaleString()} {product.currency}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.available
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.available ? "Disponible" : "No disponible"}
                        </span>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.inStock
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {product.inStock ? "En stock" : "Sin stock"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">
            {searchTerm
              ? "No se encontraron productos"
              : "No tienes productos todavía"}
          </p>
          <p className="text-gray-400 text-sm mb-6">
            {searchTerm
              ? "Intenta con otros términos de búsqueda"
              : "Crea tu primer producto para empezar a vender"}
          </p>
          {!searchTerm && (
            <button
              onClick={handleCreateProduct}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center mx-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Primer Producto
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loadingProducts && totalProducts > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-700">
                Mostrando{" "}
                <span className="font-medium">
                  {Math.min((currentPage - 1) * pageSize + 1, totalProducts)}
                </span>{" "}
                a{" "}
                <span className="font-medium">
                  {Math.min(currentPage * pageSize, totalProducts)}
                </span>{" "}
                de <span className="font-medium">{totalProducts}</span>{" "}
                productos
              </p>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="ml-4 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value={10}>10 por página</option>
                <option value={15}>15 por página</option>
                <option value={25}>25 por página</option>
                <option value={50}>50 por página</option>
              </select>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Anterior</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>

                {/* Page numbers */}
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 7) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 4) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 3) {
                    pageNumber = totalPages - 6 + i;
                  } else {
                    pageNumber = currentPage - 3 + i;
                  }

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        currentPage === pageNumber
                          ? "z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                          : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Siguiente</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
