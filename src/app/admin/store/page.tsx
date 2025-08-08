"use client";

import { StoreConfigPanel } from "@/components/StoreConfigPanel";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminStorePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const userRole = (session?.user as any)?.role;
  if (status === "loading") {
    return <div className="p-8 text-center">Cargando...</div>;
  }
  if (!session || userRole !== "ADMIN") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-red-600">
            Acceso Restringido
          </h2>
          <p className="mb-6 text-gray-700">
            No tienes permisos para acceder a esta página.
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

  return (
    <div className="min-h-screen bg-gray-50">
      <StoreConfigPanel />
    </div>
  );
}
