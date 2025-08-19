import { useState } from "react";
import { TabProps } from "./types";
import { ImageUploader } from "./Product/ImageUploader";
import { ProductImage } from "@/types/product";
import { useStore } from "@/components/StoreProvider";
import toast from "react-hot-toast";

export function BrandingTab({ config, setConfig }: TabProps) {
  const { store } = useStore();

  // Estados para las imágenes
  const [logoImages, setLogoImages] = useState<ProductImage[]>(
    config.logoUrl
      ? [{ id: "logo", url: config.logoUrl, alt: "Logo", order: 0 }]
      : []
  );
  const [faviconImages, setFaviconImages] = useState<ProductImage[]>(
    config.faviconUrl
      ? [{ id: "favicon", url: config.faviconUrl, alt: "Favicon", order: 0 }]
      : []
  );
  const [bannerImages, setBannerImages] = useState<ProductImage[]>(
    config.bannerUrl
      ? [{ id: "banner", url: config.bannerUrl, alt: "Banner", order: 0 }]
      : []
  );

  // Función para subir una imagen al servidor
  const uploadImage = async (
    image: ProductImage,
    type: "logo" | "favicon" | "banner"
  ): Promise<string> => {
    // Si la imagen ya tiene una URL que no es blob, devolverla tal como está
    if (image.url && !image.url.startsWith("blob:")) {
      return image.url;
    }

    try {
      toast.loading(`Subiendo ${type}...`, { id: `${type}-upload` });

      // Convertir blob URL a archivo para subida
      const response = await fetch(image.url);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("images", blob, `${type}.${blob.type.split("/")[1]}`);

      // Agregar el nombre del negocio como carpeta
      if (store?.name) {
        formData.append(
          "folderName",
          store.name.replace(/[^a-zA-Z0-9-_]/g, "_")
        );
      }

      const uploadResponse = await fetch(
        `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/upload/images`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.statusText}`);
      }

      const uploadResult = await uploadResponse.json();
      const uploadedUrl = uploadResult[0]?.key || uploadResult.url;

      if (uploadedUrl) {
        toast.success(
          `${type.charAt(0).toUpperCase() + type.slice(1)} subido exitosamente`,
          { id: `${type}-upload` }
        );
        return uploadedUrl;
      } else {
        throw new Error("No URL returned from upload");
      }
    } catch (error) {
      toast.error(`Error al subir ${type}`, { id: `${type}-upload` });
      throw error;
    }
  };

  const handleLogoChange = async (images: ProductImage[]) => {
    const firstImage = images[0] ? [images[0]] : [];
    setLogoImages(firstImage);

    if (firstImage[0]) {
      // Subir independientemente sin afectar otros uploads
      uploadImage(firstImage[0], "logo")
        .then((uploadedUrl) => {
          setConfig((prev) => ({
            ...prev,
            logoUrl: uploadedUrl,
          }));
        })
        .catch((error) => {
          console.error("Error uploading logo:", error);
        });
    } else {
      setConfig((prev) => ({
        ...prev,
        logoUrl: "",
      }));
    }
  };

  const handleFaviconChange = async (images: ProductImage[]) => {
    const firstImage = images[0] ? [images[0]] : [];
    setFaviconImages(firstImage);

    if (firstImage[0]) {
      // Subir independientemente sin afectar otros uploads
      uploadImage(firstImage[0], "favicon")
        .then((uploadedUrl) => {
          setConfig((prev) => ({
            ...prev,
            faviconUrl: uploadedUrl,
          }));
        })
        .catch((error) => {
          console.error("Error uploading favicon:", error);
        });
    } else {
      setConfig((prev) => ({
        ...prev,
        faviconUrl: "",
      }));
    }
  };

  const handleBannerChange = async (images: ProductImage[]) => {
    const firstImage = images[0] ? [images[0]] : [];
    setBannerImages(firstImage);

    if (firstImage[0]) {
      // Subir independientemente sin afectar otros uploads
      uploadImage(firstImage[0], "banner")
        .then((uploadedUrl) => {
          setConfig((prev) => ({
            ...prev,
            bannerUrl: uploadedUrl,
          }));
        })
        .catch((error) => {
          console.error("Error uploading banner:", error);
        });
    } else {
      setConfig((prev) => ({
        ...prev,
        bannerUrl: "",
      }));
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Marca y Apariencia</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo
          </label>
          <ImageUploader
            images={logoImages}
            onChange={handleLogoChange}
            maxImages={1}
          />
          <p className="text-xs text-gray-500 mt-1">
            Sube el logo de tu tienda
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Favicon
          </label>
          <ImageUploader
            images={faviconImages}
            onChange={handleFaviconChange}
            maxImages={1}
          />
          <p className="text-xs text-gray-500 mt-1">
            Ícono que aparece en la pestaña del navegador
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Banner
          </label>
          <ImageUploader
            images={bannerImages}
            onChange={handleBannerChange}
            maxImages={1}
          />
          <p className="text-xs text-gray-500 mt-1">
            Imagen principal de tu tienda
          </p>
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium mb-4">Colores del Tema</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { key: "primaryColor", label: "Principal" },
            { key: "secondaryColor", label: "Secundario" },
            { key: "accentColor", label: "Acento" },
            { key: "backgroundColor", label: "Fondo" },
            { key: "textColor", label: "Texto" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={(config as any)[key] || "#000000"}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  className="w-12 h-10 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  value={(config as any)[key] || ""}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                  placeholder="#000000"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
