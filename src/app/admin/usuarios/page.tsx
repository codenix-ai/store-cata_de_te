"use client";

import { useState, useMemo } from "react";
import { gql, useQuery } from "@apollo/client";
import { useStore } from "@/components/StoreProvider";
import {
  Users,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Mail,
  Calendar,
  Shield,
  Store,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  X,
} from "lucide-react";

// User type for type safety
type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  storeId?: string;
  membershipLevel?: string | null;
  createdAt: string;
  updatedAt: string;
  store?: { id: string; name: string } | null;
  addresses: {
    id: string;
    street: string;
    city: string;
    department: string;
    isDefault: boolean;
    name: string;
    phone: string;
    postalCode: string;
    userId: string;
  }[];
};

// GraphQL query to get all CUSTOMER users for a store
const GET_CUSTOMERS_BY_STORE = gql`
  query GetCustomersByStore($storeId: String!) {
    customersByStore(storeId: $storeId) {
      id
      name
      email
      role
      storeId
      membershipLevel
      createdAt
      updatedAt
      store {
        id
        name
      }
      addresses {
        id
        street
        city
        department
        isDefault
        name
        phone
        postalCode
        userId
      }
    }
  }
`;

type UserRole = "USER" | "ADMIN" | "MODERATOR" | "CUSTOMER";

export default function UsuariosPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const pageSize = 10;

  // Get storeId from context
  const { store } = useStore();
  const storeId = store?.id;

  // Apollo query for customers
  const { data, loading, error } = useQuery(GET_CUSTOMERS_BY_STORE, {
    variables: { storeId },
    skip: !storeId,
  });

  const customers: User[] = data?.customersByStore || [];

  // Filter and paginate customers
  const filteredUsers = useMemo<User[]>(() => {
    return customers.filter((user) => {
      const matchesSearch =
        search === "" ||
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      // Only show CUSTOMER role (should already be filtered by backend)
      const matchesRole = roleFilter === "" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [customers, search, roleFilter]);

  const paginatedUsers = useMemo<User[]>(() => {
    const startIndex = page * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredUsers, page, pageSize]);

  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / pageSize);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
  };

  const getRoleBadge = (role: UserRole) => {
    const styles: Record<UserRole, string> = {
      USER: "bg-green-100 text-green-800",
      ADMIN: "bg-red-100 text-red-800",
      MODERATOR: "bg-blue-100 text-blue-800",
      CUSTOMER: "bg-purple-100 text-purple-800",
    };
    return styles[role] || "bg-gray-100 text-gray-800";
  };

  const getRoleText = (role: UserRole) => {
    const text: Record<UserRole, string> = {
      USER: "Usuario",
      ADMIN: "Admin",
      MODERATOR: "Moderador",
      CUSTOMER: "Cliente",
    };
    return text[role] || role;
  };

  const getMembershipBadge = (membership: string | null) => {
    if (!membership) return "bg-gray-100 text-gray-700";
    const styles = {
      PREMIUM: "bg-purple-100 text-purple-800",
      GOLD: "bg-yellow-100 text-yellow-800",
      BASIC: "bg-gray-100 text-gray-800",
    };
    return (
      styles[membership as keyof typeof styles] || "bg-gray-100 text-gray-800"
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Users className="w-6 h-6 text-slate-900" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Usuarios
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  Administra los usuarios de la plataforma
                </p>
              </div>
            </div>
            <button className="bg-slate-900 text-white px-4 py-2.5 rounded-xl hover:bg-slate-700 flex items-center justify-center space-x-2 font-medium shadow-sm hover:shadow-md transition-all">
              <UserPlus className="w-4 h-4" />
              <span>Nuevo Usuario</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o email..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>

          {/* Filter Toggle Button (Mobile) */}
          <div className="flex justify-end items-center">
            <div className="text-sm text-gray-600">
              {totalUsers} usuario{totalUsers !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="sm:hidden bg-white border border-gray-200 rounded-xl p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filtrar por rol
                </label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos los roles</option>
                  <option value="USER">Usuario</option>
                  <option value="STORE_OWNER">Propietario</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Total
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {totalUsers}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Membresía
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Tienda
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Creado
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {paginatedUsers.map((user: User) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-slate-400 flex items-center justify-center">
                              <span className="text-sm font-semibold text-white">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadge(
                            user.role
                          )}`}
                        >
                          {getRoleText(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.membershipLevel ? (
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getMembershipBadge(
                              user.membershipLevel
                            )}`}
                          >
                            {user.membershipLevel}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {user.store ? (
                          <div className="flex items-center">
                            <Store className="w-4 h-4 mr-2 text-blue-600" />
                            <span className="text-sm text-gray-900">
                              {user.store.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">
                            Sin tienda
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

          {/* Mobile/Tablet Cards */}
          <div className="lg:hidden space-y-3">
            {paginatedUsers.map((user: User) => (
              <div
                key={user.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-xl bg-slate-400 flex items-center justify-center">
                          <span className="text-sm font-semibold text-white">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {user.name}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleBadge(
                              user.role
                            )}`}
                          >
                            {getRoleText(user.role)}
                          </span>
                          {user.membershipLevel && (
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getMembershipBadge(
                                user.membershipLevel
                              )}`}
                            >
                              {user.membershipLevel}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions Dropdown */}
                    <div className="relative flex-shrink-0">
                      <button
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === user.id ? null : user.id
                          )
                        }
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openDropdown === user.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-10">
                          <div className="py-2">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowUserModal(true);
                                setOpenDropdown(null);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Eye className="w-4 h-4 mr-3 text-blue-600" />
                              Ver detalles
                            </button>
                            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                              <Edit className="w-4 h-4 mr-3 text-green-600" />
                              Editar
                            </button>
                            <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                              <Trash2 className="w-4 h-4 mr-3" />
                              Eliminar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(user.createdAt)}
                      </div>
                      {user.store && (
                        <div className="flex items-center">
                          <Store className="w-3 h-3 mr-1" />
                          <span className="truncate max-w-24">
                            {user.store.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-4 py-3 sm:px-6">
              <div className="flex items-center justify-between">
                {/* Mobile Pagination */}
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Anterior
                  </button>
                  <span className="text-sm text-gray-700 flex items-center px-2">
                    Página {page + 1} de {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                    disabled={page === totalPages - 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>

                {/* Desktop Pagination */}
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Mostrando{" "}
                      <span className="font-medium">{page * pageSize + 1}</span>{" "}
                      a{" "}
                      <span className="font-medium">
                        {Math.min((page + 1) * pageSize, totalUsers)}
                      </span>{" "}
                      de <span className="font-medium">{totalUsers}</span>{" "}
                      resultados
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px">
                      <button
                        onClick={() => setPage(Math.max(0, page - 1))}
                        disabled={page === 0}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      {Array.from(
                        { length: Math.min(totalPages, 5) },
                        (_, i) => {
                          let pageNumber;
                          if (totalPages <= 5) {
                            pageNumber = i;
                          } else if (page <= 2) {
                            pageNumber = i;
                          } else if (page >= totalPages - 3) {
                            pageNumber = totalPages - 5 + i;
                          } else {
                            pageNumber = page - 2 + i;
                          }

                          return (
                            <button
                              key={pageNumber}
                              onClick={() => setPage(pageNumber)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${
                                pageNumber === page
                                  ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                  : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                              }`}
                            >
                              {pageNumber + 1}
                            </button>
                          );
                        }
                      )}

                      <button
                        onClick={() =>
                          setPage(Math.min(totalPages - 1, page + 1))
                        }
                        disabled={page === totalPages - 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Detail Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
            <div className="relative top-4 sm:top-20 mx-auto border w-full max-w-2xl shadow-lg rounded-2xl bg-white">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Detalles del Usuario
                  </h3>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* User Avatar and Basic Info */}
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-xl font-bold text-white">
                        {selectedUser.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {selectedUser.name}
                      </h4>
                      <div className="flex items-center text-gray-500 mt-1">
                        <Mail className="w-4 h-4 mr-1" />
                        {selectedUser.email}
                      </div>
                      <div className="flex space-x-2 mt-2">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadge(
                            selectedUser.role
                          )}`}
                        >
                          {getRoleText(selectedUser.role)}
                        </span>
                        {selectedUser.membershipLevel && (
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getMembershipBadge(
                              selectedUser.membershipLevel
                            )}`}
                          >
                            {selectedUser.membershipLevel}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* User Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          ID de Usuario
                        </label>
                        <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                          {selectedUser.id}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Fecha de Registro
                        </label>
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                          {formatDate(selectedUser.createdAt)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Última Actualización
                        </label>
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                          {formatDate(selectedUser.updatedAt)}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Estado
                        </label>
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          <div className="w-2 h-2 bg-green-600 rounded-full mr-1"></div>
                          Activo
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Store Information */}
                  {selectedUser.store && (
                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="flex items-center mb-3">
                        <Store className="w-5 h-5 text-blue-600 mr-2" />
                        <h5 className="font-semibold text-gray-900">
                          Información de la Tienda
                        </h5>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre de la Tienda
                          </label>
                          <p className="text-sm text-gray-900">
                            {selectedUser.store.name}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            ID de la Tienda
                          </label>
                          <p className="text-sm text-gray-900 font-mono">
                            {selectedUser.store.id}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Addresses */}
                  {selectedUser.addresses.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3">
                        Direcciones Registradas
                      </h5>
                      <div className="space-y-3">
                        {selectedUser.addresses.map(
                          (address: User["addresses"][0], index: number) => (
                            <div
                              key={address.id}
                              className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-gray-900 mb-1">
                                    Dirección {index + 1}
                                  </div>
                                  <div className="text-sm text-gray-700 space-y-1">
                                    <p>{address.street}</p>
                                    <p>
                                      {address.city}, {address.department}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                    <button className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 flex items-center justify-center space-x-2 font-medium transition-colors">
                      <Edit className="w-4 h-4" />
                      <span>Editar Usuario</span>
                    </button>
                    <button className="flex-1 sm:flex-none bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-200 flex items-center justify-center space-x-2 font-medium transition-colors">
                      <Mail className="w-4 h-4" />
                      <span>Enviar Email</span>
                    </button>
                    <button className="flex-1 sm:flex-none bg-red-100 text-red-700 px-4 py-2.5 rounded-xl hover:bg-red-200 flex items-center justify-center space-x-2 font-medium transition-colors">
                      <Trash2 className="w-4 h-4" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Click outside to close dropdown */}
        {openDropdown && (
          <div
            className="fixed inset-0 z-0"
            onClick={() => setOpenDropdown(null)}
          ></div>
        )}
      </div>
    </div>
  );
}
