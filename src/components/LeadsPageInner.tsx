"use client";

import React, { useState, useMemo, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useStore } from "@/components/StoreProvider";
import {
  Search,
  Eye,
  Trash2,
  Mail,
  Calendar,
  Store,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  X,
  Bell,
} from "lucide-react";

// ------------------ GraphQL Queries ------------------
const CONTACT_LEADS_BY_STORE = gql`
  query ContactLeadsByStore($storeId: ID!) {
    contactLeadsByStore(storeId: $storeId) {
      id
      firstName
      lastName
      companyName
      email
      phoneNumber
      message
      createdAt
      updatedAt
      store {
        id
        name
        email
      }
    }
  }
`;

const MARK_CONTACT_LEAD_READ = gql`
  mutation MarkContactLeadRead($leadId: ID!) {
    markContactLeadRead(leadId: $leadId) {
      id
      updatedAt
    }
  }
`;

const DELETE_CONTACT_LEAD = gql`
  mutation DeleteContactLead($leadId: ID!) {
    deleteContactLead(leadId: $leadId) {
      success
      id
    }
  }
`;

export type Lead = {
  id: string;
  firstName: string;
  lastName: string;
  companyName?: string | null;
  email: string;
  phoneNumber?: string | null;
  message?: string | null;
  createdAt: string;
  updatedAt: string;
  read?: boolean;
  store?: { id: string; name: string; email?: string } | null;
};

function useToasts() {
  const [toasts, setToasts] = useState<{ id: string; text: string }[]>([]);
  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((t) =>
      setTimeout(() => {
        setToasts((s) => s.filter((x) => x.id !== t.id));
      }, 4000)
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts]);
  const push = (text: string) => {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 7);
    setToasts((s) => [...s, { id, text }]);
  };
  const Toasts = () => (
    <div className="fixed right-4 bottom-6 flex flex-col gap-2 z-50">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg shadow-md text-sm"
        >
          {t.text}
        </div>
      ))}
    </div>
  );
  return { push, Toasts };
}

const formatDate = (d: string) =>
  new Date(d).toLocaleString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function LeadsPageInner() {
  const { store } = useStore();
  const storeId = store?.id;

  const { push, Toasts } = useToasts();

  // UI state
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "READ" | "UNREAD">(
    "ALL"
  );
  const [dateFrom, setDateFrom] = useState<string | null>(null);
  const [dateTo, setDateTo] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<"createdAt" | "firstName">(
    "createdAt"
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Data
  const { data, loading, error, refetch } = useQuery(CONTACT_LEADS_BY_STORE, {
    variables: { storeId },
    skip: !storeId,
    fetchPolicy: "network-only",
  });

  const [markReadMutation] = useMutation(MARK_CONTACT_LEAD_READ);
  const [deleteMutation] = useMutation(DELETE_CONTACT_LEAD);

  useEffect(() => {
    if (error) push("Error cargando leads: " + (error.message || ""));
  }, [error]);

  const leads: Lead[] = data?.contactLeadsByStore || [];

  // Filtering, searching, sorting (client-side for UI flexibility)
  const filtered = useMemo(() => {
    return leads
      .filter((l) => {
        if (statusFilter === "READ") return !!l.read;
        if (statusFilter === "UNREAD") return !l.read;
        return true;
      })
      .filter((l) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          `${l.firstName} ${l.lastName}`.toLowerCase().includes(q) ||
          (l.email || "").toLowerCase().includes(q) ||
          (l.companyName || "").toLowerCase().includes(q) ||
          (l.phoneNumber || "").toLowerCase().includes(q) ||
          (l.message || "").toLowerCase().includes(q)
        );
      })
      .filter((l) => {
        if (!dateFrom && !dateTo) return true;
        const created = new Date(l.createdAt).setHours(0, 0, 0, 0);
        if (dateFrom) {
          const from = new Date(dateFrom).setHours(0, 0, 0, 0);
          if (created < from) return false;
        }
        if (dateTo) {
          const to = new Date(dateTo).setHours(23, 59, 59, 999);
          if (created > to) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const dir = sortDir === "asc" ? 1 : -1;
        if (sortKey === "createdAt") {
          return (
            (new Date(a.createdAt).getTime() -
              new Date(b.createdAt).getTime()) *
            dir
          );
        }
        return a.firstName.localeCompare(b.firstName) * dir;
      });
  }, [leads, search, statusFilter, dateFrom, dateTo, sortKey, sortDir]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const paginated = useMemo(() => {
    const start = page * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // Actions
  const handleMarkRead = async (lead: Lead) => {
    if (lead.read) {
      setSelectedLead((s) =>
        s && s.id === lead.id ? { ...s, read: true } : s
      );
      return;
    }
    try {
      // optimistic UI: update local state quickly
      push("Marcando como leído...");
      await markReadMutation({ variables: { leadId: lead.id } });
      await refetch();
      push("Lead marcado como leído");
      // telemetry could be pushed here (lead_read)
    } catch (e: any) {
      push("Error marcando como leído: " + (e.message || ""));
    }
  };

  const handleDelete = async (lead: Lead) => {
    if (!confirm("¿Eliminar lead? Esta acción no se puede deshacer.")) return;
    try {
      push("Eliminando...");
      await deleteMutation({ variables: { leadId: lead.id } });
      // Try to refetch small dataset
      await refetch();
      push("Lead eliminado");
      // if the deleted lead is open, close drawer
      setSelectedLead((s) => (s && s.id === lead.id ? null : s));
    } catch (e: any) {
      push("Error eliminando lead: " + (e.message || ""));
    }
  };

  // UI helpers for sorting toggle
  const toggleSort = (key: "createdAt" | "firstName") => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toasts />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Bell className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Leads
              </h1>
              <p className="text-gray-600 text-sm">
                Contactos capturados por la tienda
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="col-span-1 lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                placeholder="Buscar por nombre, email, empresa, teléfono o mensaje..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setPage(0);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
            >
              <option value="ALL">Todos</option>
              <option value="UNREAD">No leídos</option>
              <option value="READ">Leídos</option>
            </select>

            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(0);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
          </div>
        </div>

        {/* Date filters */}
        <div className="mb-4 flex flex-col sm:flex-row gap-2 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Desde</label>
            <input
              type="date"
              value={dateFrom || ""}
              onChange={(e) => {
                setDateFrom(e.target.value || null);
                setPage(0);
              }}
              className="px-2 py-1 border rounded"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Hasta</label>
            <input
              type="date"
              value={dateTo || ""}
              onChange={(e) => {
                setDateTo(e.target.value || null);
                setPage(0);
              }}
              className="px-2 py-1 border rounded"
            />
          </div>
          <div className="ml-auto text-sm text-gray-500">
            Mostrando <strong>{total}</strong> resultados
          </div>
        </div>

        {/* Table (desktop) */}
        <div className="hidden lg:block bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <button
                      onClick={() => toggleSort("firstName")}
                      className="flex items-center gap-2"
                    >
                      Nombre
                      <span className="text-xs text-gray-400">
                        {sortKey === "firstName"
                          ? sortDir === "asc"
                            ? "↑"
                            : "↓"
                          : ""}
                      </span>
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Mensaje
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <button
                      onClick={() => toggleSort("createdAt")}
                      className="flex items-center gap-2"
                    >
                      Creado
                      <span className="text-xs text-gray-400">
                        {sortKey === "createdAt"
                          ? sortDir === "asc"
                            ? "↑"
                            : "↓"
                          : ""}
                      </span>
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginated.map((lead) => (
                  <tr
                    key={lead.id}
                    className={`${
                      !lead.read ? "bg-white" : ""
                    } hover:bg-gray-50 transition-colors`}
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {lead.firstName} {lead.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        {lead.companyName || "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 flex items-center">
                        <Mail className="w-3 h-3 mr-2" />
                        {lead.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        {lead.phoneNumber || "—"}
                      </div>
                    </td>
                    <td
                      className={`px-6 py-4 text-sm truncate max-w-xl ${
                        !lead.read ? "font-semibold" : "text-gray-600"
                      }`}
                      title={lead.message || ""}
                    >
                      {lead.message || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {lead.read ? (
                        <span className="text-xs text-gray-500">Leído</span>
                      ) : (
                        <span className="text-xs text-blue-600 font-medium">
                          No leído
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            if (!lead.read) handleMarkRead(lead);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver / Marcar como leído"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(lead)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
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

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-3">
          {paginated.map((lead) => (
            <div
              key={lead.id}
              className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden ${
                !lead.read ? "ring-2 ring-yellow-100" : ""
              }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {lead.firstName} {lead.lastName}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center mt-1 truncate">
                      <Mail className="w-3 h-3 mr-1" />
                      {lead.email}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {lead.companyName || "—"}
                    </p>
                  </div>

                  <div className="relative flex-shrink-0">
                    <button
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === lead.id ? null : lead.id
                        )
                      }
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="Más acciones"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {openDropdown === lead.id && (
                      <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-200 z-10">
                        <div className="py-2">
                          <button
                            onClick={() => {
                              setSelectedLead(lead);
                              if (!lead.read) handleMarkRead(lead);
                              setOpenDropdown(null);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Eye className="w-4 h-4 mr-3 text-blue-600" /> Ver /
                            Marcar leído
                          </button>
                          <button
                            onClick={() => {
                              handleDelete(lead);
                              setOpenDropdown(null);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-3" /> Eliminar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />{" "}
                      {formatDate(lead.createdAt)}
                    </div>
                    {lead.store && (
                      <div className="flex items-center">
                        <Store className="w-3 h-3 mr-1" />{" "}
                        <span className="truncate max-w-24">
                          {lead.store.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-4 py-3 sm:px-6">
              <div className="flex items-center justify-between">
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

                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Mostrando{" "}
                      <span className="font-medium">{page * pageSize + 1}</span>{" "}
                      a{" "}
                      <span className="font-medium">
                        {Math.min((page + 1) * pageSize, total)}
                      </span>{" "}
                      de <span className="font-medium">{total}</span> resultados
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
                          if (totalPages <= 5) pageNumber = i;
                          else if (page <= 2) pageNumber = i;
                          else if (page >= totalPages - 3)
                            pageNumber = totalPages - 5 + i;
                          else pageNumber = page - 2 + i;
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

        {/* Lead Detail Drawer / Modal */}
        {selectedLead && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4"
            role="dialog"
            aria-modal="true"
          >
            <div className="relative top-4 sm:top-10 mx-auto border w-full max-w-2xl shadow-lg rounded-2xl bg-white">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Detalle del Lead
                  </h3>
                  <div className="flex items-center space-x-2">
                    {!selectedLead.read && (
                      <button
                        onClick={() => handleMarkRead(selectedLead)}
                        className="px-3 py-2 rounded-lg bg-green-50 text-green-700 text-sm"
                      >
                        Marcar como leído
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedLead(null)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedLead.firstName} {selectedLead.lastName}
                    </p>

                    <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
                      Empresa
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedLead.companyName || "—"}
                    </p>

                    <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
                      Email
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedLead.email}
                    </p>

                    <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
                      Teléfono
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedLead.phoneNumber || "—"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mensaje
                    </label>
                    <div className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg">
                      {selectedLead.message || "—"}
                    </div>

                    <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
                      Creado
                    </label>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedLead.createdAt).toLocaleString()}
                    </p>

                    {selectedLead.store && (
                      <div className="mt-4 bg-blue-50 rounded-xl p-3">
                        <div className="text-sm text-gray-700">
                          Tienda: {selectedLead.store.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {selectedLead.store.email || "—"}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-6">
                  <button
                    onClick={() => {
                      handleDelete(selectedLead);
                      setSelectedLead(null);
                    }}
                    className="bg-red-100 text-red-700 px-4 py-2 rounded-xl"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="bg-gray-100 px-4 py-2 rounded-xl"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
