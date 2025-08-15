"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Store,
  Users,
  Package,
  BarChart3,
  TrendingUp,
  DollarSign,
} from "lucide-react";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;
  const [salesPeriod, setSalesPeriod] = useState<"week" | "month" | "year">(
    "week"
  );
  const [conversionPeriod, setConversionPeriod] = useState<
    "week" | "month" | "year"
  >("week");

  // Sales data for different periods
  const getSalesData = (period: "week" | "month" | "year") => {
    const data = {
      week: {
        labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
        values: [
          { amount: 1200 },
          { amount: 1800 },
          { amount: 2200 },
          { amount: 8000 },
          { amount: 2800 },
          { amount: 2000 },
          { amount: 7000 },
        ],
        total: 15200,
        title: "Ventas de los Últimos 7 Días",
      },
      month: {
        labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
        values: [
          { amount: 15200 },
          { amount: 18400 },
          { amount: 22800 },
          { amount: 24000 },
        ],
        total: 80400,
        title: "Ventas del Último Mes",
      },
      year: {
        labels: [
          "Ene",
          "Feb",
          "Mar",
          "Abr",
          "May",
          "Jun",
          "Jul",
          "Ago",
          "Sep",
          "Oct",
          "Nov",
          "Dic",
        ],
        values: [
          { amount: 85000 },
          { amount: 92000 },
          { amount: 88000 },
          { amount: 95000 },
          { amount: 102000 },
          { amount: 118000 },
          { amount: 125000 },
          { amount: 110000 },
          { amount: 105000 },
          { amount: 98000 },
          { amount: 89000 },
          { amount: 95000 },
        ],
        total: 1202000,
        title: "Ventas del Último Año",
      },
    };
    return data[period];
  };

  // Conversion rate data for different periods
  const getConversionData = (period: "week" | "month" | "year") => {
    const data = {
      week: {
        labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
        values: [2, 3, 1, 0.5, 1, 1, 3.5],
        average: 3.2,
        title: "Tasa de Conversión Semanal",
      },
      month: {
        labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
        values: [3.2, 3.8, 4.1, 3.9],
        average: 3.8,
        title: "Tasa de Conversión Mensual",
      },
      year: {
        labels: [
          "Ene",
          "Feb",
          "Mar",
          "Abr",
          "May",
          "Jun",
          "Jul",
          "Ago",
          "Sep",
          "Oct",
          "Nov",
          "Dic",
        ],
        values: [6, 5, 4, 3, 2, 1, 2, 4.1, 2, 3.5, 3.2, 3.0],
        average: 3.6,
        title: "Tasa de Conversión Anual",
      },
    };
    return data[period];
  };

  // Generate smooth curve path
  const generateSmoothPath = (
    values: number[],
    width: number,
    height: number
  ) => {
    if (values.length === 0) return "";

    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const range = maxValue - minValue || 1;

    const points = values.map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - minValue) / range) * height;
      return { x, y };
    });

    if (points.length === 1) {
      return `M ${points[0].x} ${points[0].y} L ${points[0].x} ${points[0].y}`;
    }

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const next = points[i + 1];

      if (i === 1) {
        // First curve
        const cp1x = prev.x + (curr.x - prev.x) * 0.3;
        const cp1y = prev.y;
        const cp2x = curr.x - (curr.x - prev.x) * 0.3;
        const cp2y = curr.y;
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      } else {
        // Subsequent curves
        const prevPrev = points[i - 2];
        const cp1x = prev.x + (curr.x - prevPrev.x) * 0.15;
        const cp1y = prev.y + (curr.y - prevPrev.y) * 0.15;

        let cp2x, cp2y;
        if (next) {
          cp2x = curr.x - (next.x - prev.x) * 0.15;
          cp2y = curr.y - (next.y - prev.y) * 0.15;
        } else {
          cp2x = curr.x - (curr.x - prev.x) * 0.3;
          cp2y = curr.y;
        }

        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      }
    }

    return path;
  };

  const currentSalesData = getSalesData(salesPeriod);
  const currentConversionData = getConversionData(conversionPeriod);

  const stats = [
    {
      name: "Productos Total",
      value: "248",
      change: "+12%",
      changeType: "positive",
      icon: Package,
    },
    {
      name: "Usuarios Activos",
      value: "1,429",
      change: "+8%",
      changeType: "positive",
      icon: Users,
    },
    {
      name: "Ventas del Mes",
      value: "$12,426",
      change: "+23%",
      changeType: "positive",
      icon: DollarSign,
    },
    {
      name: "Tasa de Conversión",
      value: "3.2%",
      change: "-2%",
      changeType: "negative",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Bienvenido de vuelta, {session?.user?.name}. Aquí tienes un resumen de
          tu tienda.
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
                  <Icon className="h-8 w-8 text-slate-900" />
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </div>
                    <div
                      className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === "positive"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 flex items-center">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-slate-900 mr-2" />
                <span className="truncate">{currentSalesData.title}</span>
              </h3>

              {/* Period Selector */}
              <div className="flex bg-gray-100 rounded-lg p-1 self-start sm:self-auto">
                {[
                  { key: "week" as const, label: "Semana" },
                  { key: "month" as const, label: "Mes" },
                  { key: "year" as const, label: "Año" },
                ].map((option) => (
                  <button
                    key={option.key}
                    onClick={() => setSalesPeriod(option.key)}
                    className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      salesPeriod === option.key
                        ? "bg-slate-900 text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-48 sm:h-64 flex items-end justify-between space-x-1 sm:space-x-2">
              {currentSalesData.values.map((data, index) => {
                // Calculate height as percentage of the maximum value in the dataset
                const maxAmount = Math.max(
                  ...currentSalesData.values.map((v) => v.amount)
                );
                const minAmount = Math.min(
                  ...currentSalesData.values.map((v) => v.amount)
                );

                // Calculate proportional height (20% to 90% range for better visibility)
                const heightRange = 70; // 90% - 20% = 70%
                const baseHeight = 20; // minimum 20%

                let heightPercentage;
                if (maxAmount === minAmount) {
                  // If all values are the same, show 50% height
                  heightPercentage = 50;
                } else {
                  // Calculate proportional height within the range
                  const normalizedValue =
                    (data.amount - minAmount) / (maxAmount - minAmount);
                  heightPercentage = baseHeight + normalizedValue * heightRange;
                }

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1 min-w-0"
                  >
                    <div className="sm:block hidden mb-1 sm:mb-2 text-xs font-medium text-gray-600 text-center">
                      $
                      {salesPeriod === "year"
                        ? (data.amount / 1000).toFixed(0) + "k"
                        : (data.amount / 1000).toFixed(1) + "k"}
                    </div>
                    <div className="flex items-end h-32 sm:h-40 w-full">
                      <div
                        className="w-full bg-blue-400 rounded-t-md transition-all duration-300 hover:bg-blue-300"
                        style={{ height: `${heightPercentage}%` }}
                      ></div>
                    </div>
                    <div className="mt-1 sm:mt-2 text-xs text-gray-500 text-center">
                      {currentSalesData.labels[index]}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 sm:mt-4 text-sm text-gray-600">
              Total del período:{" "}
              <span className="font-semibold text-slate-900">
                $
                {salesPeriod === "year"
                  ? (currentSalesData.total / 1000).toFixed(0) + "k"
                  : currentSalesData.total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Conversion Rate Chart with Smooth Curve */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 flex items-center">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-slate-900 mr-2" />
                <span className="truncate">{currentConversionData.title}</span>
              </h3>

              {/* Period Selector */}
              <div className="flex bg-gray-100 rounded-lg p-1 self-start sm:self-auto">
                {[
                  { key: "week" as const, label: "Semana" },
                  { key: "month" as const, label: "Mes" },
                  { key: "year" as const, label: "Año" },
                ].map((option) => (
                  <button
                    key={option.key}
                    onClick={() => setConversionPeriod(option.key)}
                    className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      conversionPeriod === option.key
                        ? "bg-slate-900 text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Chart Container */}
            <div className="h-48 sm:h-64 relative">
              <svg
                className="w-full h-full"
                viewBox="0 0 400 200"
                preserveAspectRatio="none"
              >
                {/* Background Grid Lines */}
                <defs>
                  <pattern
                    id="grid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="#f0f0f0"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Y-axis labels background */}
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <g key={value}>
                    <line
                      x1="0"
                      y1={200 - (value / 5) * 200}
                      x2="400"
                      y2={200 - (value / 5) * 200}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      opacity="0.5"
                    />
                  </g>
                ))}

                {/* Area under the curve (fill) */}
                <defs>
                  <linearGradient
                    id="areaGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                    <stop
                      offset="100%"
                      stopColor="#22c55e"
                      stopOpacity="0.05"
                    />
                  </linearGradient>
                </defs>

                <path
                  d={`${generateSmoothPath(
                    currentConversionData.values,
                    400,
                    200
                  )} L 400 200 L 0 200 Z`}
                  fill="url(#areaGradient)"
                />

                {/* Main curve line */}
                <path
                  d={generateSmoothPath(currentConversionData.values, 400, 200)}
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data points */}
                {currentConversionData.values.map((value, index) => {
                  const maxValue = Math.max(...currentConversionData.values);
                  const minValue = Math.min(...currentConversionData.values);
                  const range = maxValue - minValue || 1;

                  const x =
                    (index / (currentConversionData.values.length - 1)) * 400;
                  const y = 200 - ((value - minValue) / range) * 200;

                  return (
                    <g key={index}>
                      <circle
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#22c55e"
                        stroke="white"
                        strokeWidth="2"
                      />
                      {/* Hover effect */}
                      <circle
                        cx={x}
                        cy={y}
                        r="8"
                        fill="transparent"
                        className="hover:fill-green-500 hover:fill-opacity-20 cursor-pointer transition-all"
                      >
                        <title>{value}%</title>
                      </circle>
                    </g>
                  );
                })}
              </svg>

              {/* X-axis labels */}
              <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-2">
                {currentConversionData.labels.map((label, index) => (
                  <span
                    key={index}
                    className="text-xs text-gray-500 text-center"
                  >
                    <span className="block sm:hidden">{label.slice(0, 3)}</span>
                    <span className="hidden sm:block">{label}</span>
                  </span>
                ))}
              </div>

              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between -ml-8 py-1">
                {[5, 4, 3, 2, 1, 0].map((value) => (
                  <span key={value} className="text-xs text-gray-400">
                    {value}%
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 sm:mt-8 text-sm text-gray-600">
              Promedio del período:{" "}
              <span className="font-semibold text-slate-900">
                {currentConversionData.average}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Acciones Rápidas
            </h3>
            <div className="space-y-3">
              <a
                href="/admin/store"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <Store className="h-5 w-5 text-slate-900 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Configurar Tienda
                    </p>
                    <p className="text-sm text-gray-500">
                      Personaliza tu tienda y configuraciones
                    </p>
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
                    <p className="text-sm font-medium text-gray-900">
                      Gestionar Productos
                    </p>
                    <p className="text-sm text-gray-500">
                      Agregar, editar o eliminar productos
                    </p>
                  </div>
                </div>
              </a>
              {userRole === "ADMIN" && (
                <a
                  href="/admin/usuarios"
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-purple-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Gestionar Usuarios
                      </p>
                      <p className="text-sm text-gray-500">
                        Administrar usuarios y permisos
                      </p>
                    </div>
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Actividad Reciente
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">
                    Nuevo producto agregado
                  </p>
                  <p className="text-xs text-gray-500">Hace 2 horas</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-slate-900 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">
                    Configuración de tienda actualizada
                  </p>
                  <p className="text-xs text-gray-500">Hace 4 horas</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">
                    Nuevo usuario registrado
                  </p>
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
