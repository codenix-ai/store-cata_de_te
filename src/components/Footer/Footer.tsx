"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Music,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { useStore } from "@/components/StoreProvider";

export function Footer() {
  const { store } = useStore();

  const socialLinks = [
    { name: "Facebook", icon: Facebook, url: store?.facebookUrl },
    { name: "Instagram", icon: Instagram, url: store?.instagramUrl },
    { name: "Twitter", icon: Twitter, url: store?.twitterUrl },
    { name: "YouTube", icon: Youtube, url: store?.youtubeUrl },
    { name: "TikTok", icon: Music, url: store?.tiktokUrl },
  ].filter((link) => link.url);

  return (
    <footer
      className="mt-auto text-white"
      style={{ backgroundColor: store?.primaryColor || "#2563eb" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {store?.name || "EmprendyUp Store"}
            </h3>
            <p className="text-sm opacity-80">
              {store?.description ||
                "Tu tienda de confianza para productos de calidad con el mejor servicio al cliente."}
            </p>
            {store?.logoUrl && (
              <img
                src={
                  store.logoUrl.startsWith("http")
                    ? store.logoUrl
                    : `https://emprendyup-images.s3.us-east-1.amazonaws.com/${store.logoUrl}`
                }
                alt={store.name || "Logo"}
                className="h-8 w-auto"
              />
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products"
                  className="hover:opacity-80 transition-opacity"
                >
                  Productos
                </Link>
              </li>
              <li>
                <Link
                  href="/favorites"
                  className="hover:opacity-80 transition-opacity"
                >
                  Favoritos
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="hover:opacity-80 transition-opacity"
                >
                  Carrito
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="hover:opacity-80 transition-opacity"
                >
                  Soporte
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contacto</h3>
            <div className="space-y-2 text-sm">
              {store?.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>{store.phone}</span>
                </div>
              )}
              {store?.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{store.email}</span>
                </div>
              )}
              {store?.address && (
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <div>
                    <div>{store.address}</div>
                    {(store.city || store.department) && (
                      <div className="opacity-80">
                        {store.city}
                        {store.city && store.department && ", "}
                        {store.department}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Síguenos</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            {store?.whatsappNumber && (
              <a
                href={`https://wa.me/${store.whatsappNumber.replace(
                  /\D/g,
                  ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors text-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm opacity-80">
              © {new Date().getFullYear()}{" "}
              {store?.businessName || store?.name || "EmprendyUp Store"}. Todos
              los derechos reservados.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link
                href="/privacidad"
                className="hover:opacity-80 transition-opacity"
              >
                Política de Privacidad
              </Link>
              <Link
                href="/terms"
                className="hover:opacity-80 transition-opacity"
              >
                Términos de Servicio
              </Link>
              <Link
                href="/politica-devoluciones"
                className="hover:opacity-80 transition-opacity"
              >
                Política de Devoluciones
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
