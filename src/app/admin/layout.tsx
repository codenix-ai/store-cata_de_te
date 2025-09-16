"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Settings,
  Store,
  Users,
  Package,
  BarChart3,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const userRole = (session?.user as any)?.role;

  useEffect(() => {
    if (status === "loading") return;

    if (!session || (userRole !== "ADMIN" && userRole !== "STORE_OWNER")) {
      router.push("/");
    }
  }, [session, status, userRole, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  if (!session || (userRole !== "ADMIN" && userRole !== "STORE_OWNER")) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-red-600">
            Acceso Restringido
          </h2>
          <p className="mb-6 text-gray-700">
            No tienes permisos para acceder al panel de administración.
            <br />
            Si crees que esto es un error, contacta al administrador.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: BarChart3,
      roles: ["ADMIN", "STORE_OWNER"],
    },
    {
      name: "Configuración de Tienda",
      href: "/admin/store",
      icon: Store,
      roles: ["ADMIN", "STORE_OWNER"],
    },
    {
      name: "Leads",
      href: "/admin/leads",
      icon: ShoppingCart,
      roles: ["ADMIN", "STORE_OWNER"],
    },
    {
      name: "Productos",
      href: "/admin/products",
      icon: Package,
      roles: ["ADMIN", "STORE_OWNER"],
    },
    {
      name: "Ordenes",
      href: "/admin/orders",
      icon: ShoppingCart,
      roles: ["ADMIN", "STORE_OWNER"],
    },
    {
      name: "Usuarios",
      href: "/admin/usuarios",
      icon: Users,
      roles: ["ADMIN"],
    },
    {
      name: "Configuración",
      href: "/admin/settings",
      icon: Settings,
      roles: ["ADMIN"],
    },
  ];

  const filteredNavigation = navigationItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile menu backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        lg:static lg:inset-auto bg-slate-900 shadow-lg transition-all duration-300 ease-in-out overflow-hidden
        fixed inset-y-0 left-0 z-50 transform
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${sidebarCollapsed ? "lg:w-26" : "lg:w-64"}
        w-64 lg:flex lg:flex-col
      `}
      >
        <div
          className={`h-16 border-b ${
            sidebarCollapsed ? "lg:px-2" : "lg:px-6"
          } px-6`}
        >
          {/* Layout when collapsed */}
          {sidebarCollapsed ? (
            <div className="hidden lg:flex flex-col items-center justify-center h-full space-y-2">
              {/* Toggle button arriba */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="text-slate-400 hover:text-white transition-colors p-1 mt-10 rounded hover:bg-slate-800"
                title="Expandir menú"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              {/* Logo abajo */}
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="hover:bg-slate-800 rounded p-1 transition-colors"
                title="Expandir menú"
              >
                <Image
                  src="/logo.svg"
                  alt="EmprendyUp Logo"
                  width={30}
                  height={30}
                  className="w-10 h-10"
                />
              </button>
            </div>
          ) : (
            /* Layout when expanded */
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center space-x-3">
                <Image
                  src="/logo.svg"
                  alt="EmprendyUp Logo"
                  width={32}
                  height={32}
                  className="w-10 h-10 flex-shrink-0"
                />
                <span className="text-xl font-bold text-white">
                  Admin Panel
                </span>
                {/* Toggle button al lado del logo */}
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="hidden lg:block text-slate-400 hover:text-white transition-colors p-1 rounded hover:bg-slate-800"
                  title="Colapsar menú"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>

              {/* Close button for mobile */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          )}

          {/* Mobile layout (always expanded style) */}
        </div>

        <nav
          className={`flex-1 flex flex-col px-4  ${
            sidebarCollapsed ? " py-16" : "py-10"
          }`}
        >
          <div
            className={`flex flex-col flex-1 ${
              sidebarCollapsed ? "gap-4" : "gap-1.5"
            }`}
          >
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors group relative ${
                    sidebarCollapsed ? "lg:justify-center" : ""
                  }`}
                  onClick={() => {
                    setSidebarOpen(false);
                    // Solo colapsar automáticamente en desktop, no en mobile
                    if (window.innerWidth >= 1024) {
                      setSidebarCollapsed(true);
                    }
                  }}
                >
                  <Icon className="w-6 h-6 flex-shrink-0" />
                  <span
                    className={`ml-3 transition-opacity duration-300 ${
                      sidebarCollapsed
                        ? "lg:opacity-0 lg:hidden"
                        : "opacity-100"
                    }`}
                  >
                    {item.name}
                  </span>

                  {/* Tooltip for collapsed state */}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-slate-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 hidden lg:block">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-slate-700 pt-4 mt-auto">
            <div className={`px-4 py-2 ${sidebarCollapsed ? "lg:hidden" : ""}`}>
              {!sidebarCollapsed && (
                <>
                  <p className="text-sm font-medium text-white">
                    {session.user?.name}
                  </p>
                  <p className="text-sm text-slate-400">
                    {session.user?.email}
                  </p>
                  <p className="text-xs text-blue-400 mt-1">{userRole}</p>
                </>
              )}
            </div>

            <button
              onClick={() => {
                router.push("/");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center px-4 py-3 mt-2 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors group relative ${
                sidebarCollapsed ? "lg:justify-center" : ""
              }`}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span
                className={`ml-3 transition-opacity duration-300 ${
                  sidebarCollapsed ? "lg:opacity-0 lg:hidden" : "opacity-100"
                }`}
              >
                Volver al sitio
              </span>

              {/* Tooltip for collapsed state */}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 hidden lg:block">
                  Volver al sitio
                </div>
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden flex-shrink-0">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-400 hover:text-gray-600"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              Panel de Administración
            </h1>
            <div className="w-6" /> {/* Spacer for alignment */}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
