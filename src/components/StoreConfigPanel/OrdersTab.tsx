"use client";

import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Calendar,
  CreditCard,
  Package,
} from "lucide-react";
import { useStore } from "../StoreProvider";

// SSR-safe number formatting helper
function formatNumber(num: number) {
  if (typeof window !== "undefined") {
    return num.toLocaleString("es-CO");
  }
  return num.toString();
}

// GraphQL query for orders by store
const GET_ORDERS_BY_STORE = gql`
  query OrdersByStore($storeId: String!) {
    ordersByStore(storeId: $storeId) {
      id
      status
      total
      subtotal
      tax
      shipping
      createdAt
      userName
      items {
        id
        productName
        quantity
        price
        product {
          name
          images {
            url
          }
        }
      }
      address {
        name
        street
      }
      store {
        id
        name
        logoUrl
      }
    }
  }
`;

export function OrdersTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const pageSize = 10;
  const { store } = useStore();

  // Apollo query for orders
  const storeId = store?.id;
  const { data, loading, error } = useQuery(GET_ORDERS_BY_STORE, {
    variables: { storeId },
    skip: !storeId,
  });

  // Map backend fields to UI shape
  const orders = (data?.ordersByStore || []).map((order: any) => ({
    ...order,
    user: order.user || { name: "", email: "" },
    items: order.items || [],
  }));

  // Colores
  const primaryColor = "#0F172A"; // slate-900
  const secondaryColor = store?.secondaryColor || "#10B981";

  // Filtrado por búsqueda
  const filteredOrders = orders.filter(
    (order: any) =>
      (order.user?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (order.user?.email || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalOrders = filteredOrders.length;
  const totalPages = Math.ceil(totalOrders / pageSize);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "SHIPPED":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "DELIVERED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Pendiente";
      case "PROCESSING":
        return "Procesando";
      case "SHIPPED":
        return "Enviado";
      case "DELIVERED":
        return "Entregado";
      case "CANCELLED":
        return "Cancelada";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <span className="text-gray-500">Cargando órdenes...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <span className="text-red-500">Error al cargar las órdenes.</span>
      </div>
    );
  }

  function formatNumber(value: number): string {
    return value.toLocaleString("es-CO");
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Gestión de Órdenes
        </h3>
        <p className="text-sm text-gray-600">
          Revisa y administra las órdenes de tu tienda
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Buscar por cliente, email o ID de orden..."
          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all"
        />
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        {totalOrders}{" "}
        {totalOrders === 1 ? "orden encontrada" : "órdenes encontradas"}
      </div>

      {/* Desktop Table - Hidden on mobile */}
      <div className="hidden lg:block bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                Cliente
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                Total
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                Estado
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                Fecha
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {paginatedOrders.map((order: any) => (
              <>
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {order.userName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {(order.total ?? 0).toLocaleString("es-CO")}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString("es-CO", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => toggleOrderExpansion(order.id)}
                      className="p-2 text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
                {expandedOrders.has(order.id) && (
                  <tr key={order.id + "-expanded"}>
                    <td colSpan={6} className="px-6 py-4 bg-gray-50">
                      <div className="space-y-4">
                        {/* Products Section */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">
                            Productos ({order.items.length})
                          </h4>
                          <div className="grid gap-3 md:grid-cols-2">
                            {order.items.map((item: any) => (
                              <div
                                key={item.id}
                                className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200"
                              >
                                <div className="flex-shrink-0">
                                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white border border-gray-200">
                                    <img
                                      src={item.product.image}
                                      alt={item.productName}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                      }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 hidden">
                                      <Package className="w-5 h-5 text-gray-400" />
                                    </div>
                                  </div>
                                </div>
                                <div className="flex-grow min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {item.product.productName}
                                  </p>
                                  <div className="flex items-center justify-between mt-1">
                                    <span className="text-xs text-gray-500">
                                      Cantidad:{" "}
                                      <span className="font-semibold">
                                        {item.quantity}
                                      </span>
                                    </span>
                                    <div className="text-right">
                                      <div className="text-sm font-semibold text-gray-900">
                                        {(
                                          (item.price ?? 0) *
                                          (item.quantity ?? 0)
                                        ).toLocaleString("es-CO")}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {formatNumber(item.price ?? 0)} c/u
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div className="border-t border-gray-200 pt-3">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">
                            Resumen de la orden
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Subtotal:</span>
                              <span className="font-medium">
                                {(order.subtotal ?? 0).toLocaleString("es-CO")}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Impuestos:</span>
                              <span className="font-medium">
                                {(order.tax ?? 0).toLocaleString("es-CO")}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Envío:</span>
                              <span className="font-medium">
                                {(order.shipping ?? 0).toLocaleString("es-CO")}
                              </span>
                            </div>
                            <div className="flex justify-between font-bold text-base">
                              <span>Total:</span>
                              <span>
                                {(order.total ?? 0).toLocaleString("es-CO")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards - Visible on mobile and tablet */}
      <div className="lg:hidden space-y-4">
        {paginatedOrders.map((order: any) => (
          <div
            key={order.id}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Header with ID and Status */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-mono text-sm font-semibold text-gray-900 mb-1">
                  {order.id}
                </p>
                <span
                  className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                    order.status
                  )}`}
                >
                  {getStatusText(order.status)}
                </span>
              </div>
              <button className="p-2 text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                <Eye className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Info */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center text-sm text-gray-700">
                <User className="w-4 h-4 mr-2 text-gray-400" />
                <span className="font-medium">{order.userName}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                <span>{order.user.email}</span>
              </div>
            </div>

            {/* Order Details */}
            <div className="border-t border-gray-100 pt-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
                  <span>Total</span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {formatNumber(order.total ?? 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  <span>Fecha</span>
                </div>
                <span className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString("es-CO", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            {/* Order breakdown - collapsible details */}
            <details className="mt-3">
              <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800 transition-colors">
                Ver detalles del pedido ({order.items.length}{" "}
                {order.items.length === 1 ? "producto" : "productos"})
              </summary>
              <div className="mt-3 pt-3 border-t border-gray-100 space-y-4">
                {/* Products List */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-900">
                    Productos:
                  </h4>
                  {order.items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <div className="flex-shrink-0">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-white border border-gray-200">
                          <img
                            src={item.product.image}
                            alt={item.product.productName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 hidden">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                        </div>
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                          {item.product.productName}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            <span className="inline-flex items-center">
                              Cantidad:{" "}
                              <span className="font-semibold ml-1">
                                {item.quantity}
                              </span>
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-gray-900">
                              $
                              {formatNumber(
                                (item.price ?? 0) * (item.quantity ?? 0)
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatNumber(item.price ?? 0)} c/u
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="border-t border-gray-200 pt-3 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>{formatNumber(order.subtotal ?? 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Impuestos:</span>
                    <span>{formatNumber(order.tax ?? 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Envío:</span>
                    <span>{formatNumber(order.shipping ?? 0)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-base border-t border-gray-200 pt-2">
                    <span>Total:</span>
                    <span>{formatNumber(order.total ?? 0)}</span>
                  </div>
                </div>
              </div>
            </details>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {paginatedOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron órdenes
          </h3>
          <p className="text-gray-600">
            {searchTerm
              ? "Intenta con otros términos de búsqueda"
              : "Aún no hay órdenes registradas"}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalOrders > pageSize && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-sm text-gray-600">
            Mostrando {Math.min((currentPage - 1) * pageSize + 1, totalOrders)}{" "}
            a {Math.min(currentPage * pageSize, totalOrders)} de {totalOrders}{" "}
            órdenes
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center px-3 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Anterior</span>
            </button>
            <span className="px-3 py-2 text-sm text-gray-600">
              {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center px-3 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
