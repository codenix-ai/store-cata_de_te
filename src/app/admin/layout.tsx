'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Settings, Store, Users, Package, BarChart3, LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userRole = (session?.user as any)?.role;

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || (userRole !== 'ADMIN' && userRole !== 'STORE_OWNER')) {
      router.push('/');
    }
  }, [session, status, userRole, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  if (!session || (userRole !== 'ADMIN' && userRole !== 'STORE_OWNER')) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Acceso Restringido</h2>
          <p className="mb-6 text-gray-700">
            No tienes permisos para acceder al panel de administración.
            <br />
            Si crees que esto es un error, contacta al administrador.
          </p>
          <button
            onClick={() => router.push('/')}
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
      name: 'Dashboard',
      href: '/admin',
      icon: BarChart3,
      roles: ['ADMIN', 'STORE_OWNER'],
    },
    {
      name: 'Configuración de Tienda',
      href: '/admin/store',
      icon: Store,
      roles: ['ADMIN', 'STORE_OWNER'],
    },
    {
      name: 'Productos',
      href: '/admin/products',
      icon: Package,
      roles: ['ADMIN', 'STORE_OWNER'],
    },
    {
      name: 'Usuarios',
      href: '/admin/users',
      icon: Users,
      roles: ['ADMIN'],
    },
    {
      name: 'Configuración',
      href: '/admin/settings',
      icon: Settings,
      roles: ['ADMIN'],
    },
  ];

  const filteredNavigation = navigationItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile menu backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Store className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Admin Panel</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-6 px-4">
          <div className="space-y-2">
            {filteredNavigation.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="px-4 py-2">
              <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
              <p className="text-sm text-gray-500">{session.user?.email}</p>
              <p className="text-xs text-blue-600 mt-1">{userRole}</p>
            </div>

            <button
              onClick={() => {
                router.push('/');
                setSidebarOpen(false);
              }}
              className="w-full flex items-center px-4 py-3 mt-2 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Volver al sitio
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-gray-600">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Panel de Administración</h1>
            <div className="w-6" /> {/* Spacer for alignment */}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
