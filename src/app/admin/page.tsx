'use client';

import { useQuery, gql } from '@apollo/client';
import { Package, Users, DollarSign, TrendingUp, Store } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;
  const { data: totalProductsData } = useQuery(gql`
    query {
      totalProducts
    }
  `);

  const { data: activeUsersData } = useQuery(gql`
    query {
      activeUsers {
        count
        percentageChange
      }
    }
  `);

  const { data: monthlySalesData } = useQuery(gql`
    query {
      monthlySales {
        totalSales
        percentageChange
        periodLabel
      }
    }
  `);

  const { data: conversionRateData } = useQuery(gql`
    query {
      conversionRate {
        conversionRate
        percentageChange
        periodLabel
      }
    }
  `);

  const stats = [
    {
      name: 'Productos Total',
      value: totalProductsData?.totalProducts ?? '--',
      change: '',
      changeType: 'neutral',
      icon: Package,
    },
    {
      name: 'Usuarios Activos',
      value: activeUsersData?.activeUsers?.count ?? '--',
      change: (activeUsersData?.activeUsers?.percentageChange ?? 0) + '%',
      changeType: (activeUsersData?.activeUsers?.percentageChange ?? 0) >= 0 ? 'positive' : 'negative',
      icon: Users,
    },
    {
      name: 'Ventas del Mes',
      value: '$' + (monthlySalesData?.monthlySales?.[0]?.totalSales?.toLocaleString() ?? '--'),
      change: (monthlySalesData?.monthlySales?.[0]?.percentageChange ?? 0) + '%',
      changeType: (monthlySalesData?.monthlySales?.[0]?.percentageChange ?? 0) >= 0 ? 'positive' : 'negative',
      icon: DollarSign,
    },
    {
      name: 'Tasa de Conversión',
      value: (conversionRateData?.conversionRate?.[0]?.conversionRate ?? '--') + '%',
      change: (conversionRateData?.conversionRate?.[0]?.percentageChange ?? 0) + '%',
      changeType: (conversionRateData?.conversionRate?.[0]?.percentageChange ?? 0) >= 0 ? 'positive' : 'negative',
      icon: TrendingUp,
    },
  ];

  const currentSalesData = monthlySalesData?.monthlySales ?? [];
  const currentConversionData = conversionRateData?.conversionRate ?? [];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow p-6 flex flex-col">
            <div className="flex items-center justify-between">
              <stat.icon className="h-6 w-6 text-gray-400" />
              <span
                className={`text-sm font-medium ${
                  stat.changeType === 'positive'
                    ? 'text-green-500'
                    : stat.changeType === 'negative'
                    ? 'text-red-500'
                    : 'text-gray-500'
                }`}
              >
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-gray-500 text-sm">{stat.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficas */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ventas */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold mb-4">Ventas del Mes</h2>
          {currentSalesData.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-gray-400 text-sm">No hay ventas aún</div>
          ) : (
            <>
              <div className="flex gap-2 items-end h-32">
                {currentSalesData.map((item: any, index: any) => (
                  <div
                    key={index}
                    className="bg-blue-500 rounded w-full"
                    style={{
                      height: `${Math.max(10, item.totalSales / 10)}%`,
                    }}
                  ></div>
                ))}
              </div>
              <div className="flex justify-between mt-2">
                {currentSalesData.map((item: any, index: any) => (
                  <div key={index} className="text-xs text-gray-500">
                    {item.periodLabel}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Conversión */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold mb-4">Tasa de Conversión</h2>
          {currentConversionData.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-gray-400 text-sm">
              No hay datos de conversión aún
            </div>
          ) : (
            <>
              <div className="relative h-32">
                <svg className="absolute bottom-0 left-0 w-full h-full">
                  <polyline
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2"
                    points={currentConversionData
                      .map((item: any, index: any) => {
                        const x = (index / (currentConversionData.length - 1)) * 100;
                        const y = 100 - item.conversionRate;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />
                </svg>
              </div>
              <div className="flex justify-between mt-2">
                {currentConversionData.map((item: any, index: any) => (
                  <div key={index} className="text-xs text-gray-500">
                    {item.periodLabel}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-10">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="space-y-3">
              <Link
                href="/admin/store"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <Store className="h-5 w-5 text-slate-900 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Configurar Tienda</p>
                    <p className="text-sm text-gray-500">Personaliza tu tienda y configuraciones</p>
                  </div>
                </div>
              </Link>
              <Link
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
              </Link>
              {userRole === 'ADMIN' && (
                <Link
                  href="/admin/usuarios"
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-purple-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Gestionar Usuarios</p>
                      <p className="text-sm text-gray-500">Administrar usuarios y permisos</p>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
