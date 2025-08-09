'use client';

import { useSession } from 'next-auth/react';
import { Store, Users, Package, BarChart3, TrendingUp, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;

  const stats = [
    {
      name: 'Productos Total',
      value: '248',
      change: '+12%',
      changeType: 'positive',
      icon: Package,
    },
    {
      name: 'Usuarios Activos',
      value: '1,429',
      change: '+8%',
      changeType: 'positive',
      icon: Users,
    },
    {
      name: 'Ventas del Mes',
      value: '$12,426',
      change: '+23%',
      changeType: 'positive',
      icon: DollarSign,
    },
    {
      name: 'Tasa de Conversión',
      value: '3.2%',
      change: '-2%',
      changeType: 'negative',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Bienvenido de vuelta, {session?.user?.name}. Aquí tienes un resumen de tu tienda.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="space-y-3">
              <a
                href="/admin/store"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <Store className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Configurar Tienda</p>
                    <p className="text-sm text-gray-500">Personaliza tu tienda y configuraciones</p>
                  </div>
                </div>
              </a>
              <a
                href="/admin/products"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Gestionar Productos</p>
                    <p className="text-sm text-gray-500">Agregar, editar o eliminar productos</p>
                  </div>
                </div>
              </a>
              {userRole === 'ADMIN' && (
                <a
                  href="/admin/users"
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-purple-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Gestionar Usuarios</p>
                      <p className="text-sm text-gray-500">Administrar usuarios y permisos</p>
                    </div>
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Actividad Reciente</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Nuevo producto agregado</p>
                  <p className="text-xs text-gray-500">Hace 2 horas</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Configuración de tienda actualizada</p>
                  <p className="text-xs text-gray-500">Hace 4 horas</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Nuevo usuario registrado</p>
                  <p className="text-xs text-gray-500">Hace 6 horas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
