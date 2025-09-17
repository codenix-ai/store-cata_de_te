"use client";
import React, { useState } from "react";
import Image from "next/image";
import { cartService, Cart as CartType, CartItem } from "@/lib/cart";
import { useStore } from "@/components/StoreProvider";
import { ChevronDown, ChevronRight, Link } from "lucide-react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// GraphQL mutation to create address
const CREATE_ADDRESS = gql`
  mutation CreateAddress($input: CreateAddressInput!) {
    createAddress(input: $input) {
      id
      name
      street
      city
      department
      postalCode
      phone
      isDefault
      userId
    }
  }
`;

const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      status
      total
      subtotal
      tax
      shipping
      createdAt
      items {
        id
        quantity
        price
        productId
      }
    }
  }
`;

interface Address {
  id?: string;
  name: string;
  street: string;
  city: string;
  department: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}
interface CreateAddressInput {
  name: string;
  street: string;
  city: string;
  department: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}
interface OrderItemInput {
  productId: string;
  quantity: number;
  unitPrice: number; // GraphQL input expects "unitPrice"
}
interface CreateOrderInput {
  addressId: string;
  items: OrderItemInput[];
  storeId?: string; // Optional, some backends require this for product validation
}
interface AccordionStepProps {
  step: number;
  title: string;
  isOpen: boolean;
  isCompleted: boolean;
  isDisabled?: boolean;
  children: React.ReactNode;
  onToggle: () => void;
}

const AccordionStep: React.FC<AccordionStepProps> = ({
  step,
  title,
  isOpen,
  isCompleted,
  isDisabled = false,
  children,
  onToggle,
}) => {
  const { store } = useStore();

  return (
    <div
      className={`border border-gray-200 rounded-lg mb-4 ${
        isDisabled ? "opacity-50" : ""
      }`}
    >
      <button
        onClick={isDisabled ? undefined : onToggle}
        disabled={isDisabled}
        title={isDisabled ? "Completa el paso anterior para continuar" : ""}
        className={`w-full px-6 py-4 flex items-center justify-between text-left transition-colors ${
          isDisabled ? "cursor-not-allowed" : "hover:bg-gray-50"
        }`}
      >
        <div className="flex items-center space-x-4">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
              isCompleted
                ? "bg-green-500"
                : isOpen
                ? store?.primaryColor || "bg-blue-600"
                : isDisabled
                ? "bg-gray-300"
                : "bg-gray-400"
            }`}
            style={
              isOpen && !isCompleted && !isDisabled
                ? { backgroundColor: store?.primaryColor || "#2563eb" }
                : {}
            }
          >
            {isCompleted ? "✓" : step}
          </div>
          <h3
            className={`text-lg font-semibold ${
              isDisabled ? "text-gray-400" : "text-gray-900"
            }`}
          >
            {title}
          </h3>
        </div>
        {isDisabled ? (
          <span className="text-xs text-gray-400 italic"></span>
        ) : isOpen ? (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isOpen && !isDisabled && <div className="px-6 pb-6">{children}</div>}
    </div>
  );
};

interface OrderSummaryProps {
  cart: CartType;
  store?: any; // Optional for future theming support
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function OrderSummary({ cart, store }: OrderSummaryProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold text-black">Resumen del Pedido</h3>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">
            ${cart.subtotal.toLocaleString("es-CO")}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">IVA (19%):</span>
          <span className="font-medium">
            ${cart.tax.toLocaleString("es-CO")}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Envío:</span>
          <span className="font-medium">
            {cart.shipping === 0
              ? "Gratis"
              : `$${cart.shipping.toLocaleString("es-CO")}`}
          </span>
        </div>
        {cart.shipping === 0 && cart.subtotal >= 150000 && (
          <p className="text-sm text-green-600">
            ¡Envío gratis por compras superiores a $150.000!
          </p>
        )}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-black">Total:</span>
          <span className="text-xl font-bold text-black">
            ${cart.total.toLocaleString("es-CO")}
          </span>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mt-6 pt-6 border-t">
        <h4 className="text-sm font-medium text-black mb-3">
          Métodos de Pago Aceptados:
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white p-2 rounded border text-center text-xs font-medium">
            MercadoPago
          </div>
          <div className="bg-white p-2 rounded border text-center text-xs font-medium">
            Wompi
          </div>
          <div className="bg-white p-2 rounded border text-center text-xs font-medium">
            ePayco
          </div>
          <div className="bg-white p-2 rounded border text-center text-xs font-medium">
            Tarjeta
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Order() {
  const [cart, setCart] = useState<CartType>({
    items: [],
    total: 0,
    subtotal: 0,
    tax: 0,
    shipping: 0,
  });
  const { store } = useStore();
  const router = useRouter();
  const { data: session } = useSession();
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // GraphQL mutation hook
  const [createAddress] = useMutation(CREATE_ADDRESS);
  const [createOrder] = useMutation(CREATE_ORDER);

  // Colombian departments and cities data
  const departments = [
    "Amazonas",
    "Cundinamarca",
    "Antioquia",
    "Arauca",
    "Atlántico",
    "Bolívar",
    "Boyacá",
    "Caldas",
    "Caquetá",
    "Casanare",
    "Cauca",
  ];

  const cities = [
    "Bogotá",
    "Medellín",
    "Cali",
    "Barranquilla",
    "Cúcuta",
    "Bucaramanga",
    "Pereira",
    "Santa Marta",
    "Ibagué",
    "Manizales",
    "Valledupar",
  ];

  // Load cart on component mount
  React.useEffect(() => {
    setCart(cartService.getCart());
  }, []);

  const [address, setAddress] = useState<Address>({
    name: "",
    street: "",
    city: "",
    department: "",
    postalCode: "",
    phone: "",
    isDefault: false,
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolder: "",
  });

  // Function to format expiry date input
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digits

    if (value.length >= 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }

    // Limit to MM/YY format (5 characters max)
    if (value.length > 5) {
      value = value.substring(0, 5);
    }

    setPaymentInfo({
      ...paymentInfo,
      expiryDate: value,
    });
  };

  const handleStepToggle = (step: number) => {
    // Prevent accessing steps that require previous completion
    if (step === 2 && cart.items.length === 0) {
      alert("Agrega productos al carrito antes de continuar");
      return;
    }

    if (step === 3 && !isAddressCompleted) {
      alert("Completa la información de dirección antes de continuar");
      return;
    }

    setActiveStep(activeStep === step ? 0 : step);
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is authenticated
    if (!session) {
      alert("Debes iniciar sesión para guardar la dirección");
      return;
    }

    const isValid =
      address.name &&
      address.street &&
      address.city &&
      address.department &&
      address.phone;

    if (!isValid) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    setIsSubmittingAddress(true);

    try {
      // Create address input for GraphQL mutation
      const addressInput = {
        name: address.name,
        street: address.street,
        city: address.city,
        department: address.department,
        postalCode: address.postalCode,
        phone: address.phone,
        isDefault: address.isDefault,
      };

      // Execute the mutation
      const { data } = await createAddress({
        variables: {
          input: addressInput,
        },
      });

      // Update the address state with the returned ID
      setAddress((prev) => ({
        ...prev,
        id: data.createAddress.id,
      }));

      // Mark step as completed and move to next step
      setCompletedSteps([...completedSteps.filter((s) => s !== 2), 2]);
      setActiveStep(3);
    } catch (error) {
      console.error("Error creating address:", error);

      // More detailed error logging
      if (error instanceof Error) {
        console.error("Error message:", error.message);
      }

      alert("Error al guardar la dirección. Por favor intenta nuevamente.");
    } finally {
      setIsSubmittingAddress(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is authenticated
    if (!session) {
      alert("Debes iniciar sesión para completar la orden");
      return;
    }

    // Check if address is saved
    if (!address.id) {
      alert("Debes guardar la dirección antes de completar la orden");
      return;
    }

    const isValid =
      paymentInfo.cardNumber &&
      paymentInfo.expiryDate &&
      paymentInfo.cvv &&
      paymentInfo.cardHolder;

    if (!isValid) {
      alert("Por favor completa toda la información de pago");
      return;
    }

    setIsSubmittingOrder(true);

    try {
      // Prepare order items from cart
      const orderItems: OrderItemInput[] = cart.items.map((item: CartItem) => ({
        productId: item.productId, // Use productId instead of id
        quantity: item.quantity,
        unitPrice: item.price, // GraphQL input expects "unitPrice"
      }));

      // Create order input for GraphQL mutation
      // Backend will calculate subtotal, tax, shippingCost, and total automatically
      const orderInput: CreateOrderInput = {
        addressId: address.id,
        items: orderItems,
        // Include store ID if available - some backends require this for product validation
        ...(store?.id && { storeId: store.id }),
        ...(store?.storeId && !store?.id && { storeId: store.storeId }),
      };

      // Execute the mutation
      const { data } = await createOrder({
        variables: {
          input: orderInput,
        },
      });
      // Mark step as completed
      setCompletedSteps([...completedSteps.filter((s) => s !== 3), 3]);

      // Clear the cart
      cartService.clearCart();
      setCart({
        items: [],
        total: 0,
        subtotal: 0,
        tax: 0,
        shipping: 0,
      });

      // Set default status to pending if not provided by backend
      const orderStatus = data.createOrder.status || "pending";

      // Show success toast for 10 seconds
      toast.success(
        `¡Orden completada exitosamente! Número de orden: ${data.createOrder.id} - Estado: ${orderStatus}`,
        {
          duration: 10000, // 10 seconds
          position: "top-center",
          style: {
            background: "#10B981",
            color: "#fff",
            padding: "16px",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
          },
        }
      );

      // Redirect to success page after toast duration
      setTimeout(() => {
        router.push("/orden-exitosa");
      }, 10000);

      // Optional: redirect to order confirmation page
      // window.location.href = `/orders/${data.createOrder.id}`;
    } catch (error) {
      console.error("Error creating order:", error);

      // More detailed error logging
      if (error instanceof Error) {
        console.error("Error message:", error.message);
      }

      // Log GraphQL errors specifically
      if ((error as any).graphQLErrors) {
        console.error("GraphQL errors:", (error as any).graphQLErrors);
      }

      if ((error as any).networkError) {
        console.error("Network error:", (error as any).networkError);
      }

      alert("Error al crear la orden. Por favor intenta nuevamente.");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const isAddressCompleted = completedSteps.includes(2);
  const isPaymentCompleted = completedSteps.includes(3);

  // Show login prompt if not authenticated
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Inicia sesión para continuar
            </h2>
            <p className="text-gray-600 mb-6">
              Necesitas iniciar sesión para guardar tu dirección y completar la
              orden.
            </p>
            <a
              href="/auth/signin"
              className="inline-block px-6 py-3 text-white rounded-md hover:opacity-90 transition-colors"
              style={{
                backgroundColor: store?.primaryColor || "#2563eb",
              }}
            >
              Iniciar Sesión
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Finalizar Orden
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column (2/3 width) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-8">
                {/* Step 1: Order Summary */}
                <AccordionStep
                  step={1}
                  title="Resumen de la Orden"
                  isOpen={activeStep === 1}
                  isCompleted={true}
                  onToggle={() => handleStepToggle(1)}
                >
                  <div className="space-y-4">
                    {cart.items.map((item: CartItem) => (
                      <div
                        key={`${item.id}-${item.variant}`}
                        className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                      >
                        <Image
                          src={
                            item.image?.startsWith("http")
                              ? item.image
                              : `https://emprendyup-images.s3.us-east-1.amazonaws.com/${item.image}`
                          }
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {item.name}
                          </h4>
                          {item.variant && (
                            <p className="text-sm text-gray-500">
                              Variante: {item.variant}
                            </p>
                          )}
                          <p className="text-sm text-gray-500">
                            Cantidad: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            ${(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionStep>

                {/* Step 2: Address Form */}
                <AccordionStep
                  step={2}
                  title="Dirección de Entrega"
                  isOpen={activeStep === 2}
                  isCompleted={isAddressCompleted}
                  isDisabled={cart.items.length === 0}
                  onToggle={() => handleStepToggle(2)}
                >
                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dirección *
                      </label>
                      <input
                        type="text"
                        required
                        value={address.street}
                        onChange={(e) =>
                          setAddress({ ...address, street: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 "
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Descripcion *
                        </label>
                        <input
                          type="text"
                          required
                          value={address.name}
                          onChange={(e) =>
                            setAddress({ ...address, name: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Teléfono *
                        </label>
                        <input
                          type="tel"
                          required
                          value={address.phone}
                          onChange={(e) =>
                            setAddress({ ...address, phone: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 "
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ciudad *
                        </label>
                        <select
                          required
                          value={address.city}
                          onChange={(e) =>
                            setAddress({ ...address, city: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 "
                        >
                          <option value="">Selecciona </option>
                          {cities.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Departamento *
                        </label>
                        <select
                          required
                          value={address.department}
                          onChange={(e) =>
                            setAddress({
                              ...address,
                              department: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 "
                        >
                          <option value="">Selecciona </option>
                          {departments.map((department) => (
                            <option key={department} value={department}>
                              {department}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Código Postal
                        </label>
                        <input
                          type="text"
                          value={address.postalCode}
                          onChange={(e) =>
                            setAddress({
                              ...address,
                              postalCode: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 "
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={address.isDefault}
                        onChange={(e) =>
                          setAddress({
                            ...address,
                            isDefault: e.target.checked,
                          })
                        }
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 "
                      />
                      <label
                        htmlFor="isDefault"
                        className="ml-2 text-sm text-gray-700"
                      >
                        Establecer como dirección predeterminada
                      </label>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmittingAddress}
                        className="px-6 py-2 text-white rounded-md hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          backgroundColor: store?.primaryColor || "#2563eb",
                        }}
                      >
                        {isSubmittingAddress ? "Guardando..." : "Continuar"}
                      </button>
                    </div>
                  </form>
                </AccordionStep>

                {/* Step 3: Payment Information */}
                <AccordionStep
                  step={3}
                  title="Información de Pago"
                  isOpen={activeStep === 3}
                  isCompleted={isPaymentCompleted}
                  isDisabled={!isAddressCompleted}
                  onToggle={() => handleStepToggle(3)}
                >
                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Titular de la Tarjeta *
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentInfo.cardHolder}
                        onChange={(e) =>
                          setPaymentInfo({
                            ...paymentInfo,
                            cardHolder: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 "
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de Tarjeta *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="1234 5678 9012 3456"
                        value={paymentInfo.cardNumber}
                        onChange={(e) =>
                          setPaymentInfo({
                            ...paymentInfo,
                            cardNumber: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 "
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fecha de Vencimiento *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="MM/YY"
                          value={paymentInfo.expiryDate}
                          onChange={handleExpiryDateChange}
                          maxLength={5}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 "
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="123"
                          value={paymentInfo.cvv}
                          onChange={(e) =>
                            setPaymentInfo({
                              ...paymentInfo,
                              cvv: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 "
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setActiveStep(2)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Volver
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingOrder}
                        className="px-6 py-2 text-white rounded-md hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          backgroundColor: store?.primaryColor || "#2563eb",
                        }}
                      >
                        {isSubmittingOrder
                          ? "Procesando..."
                          : "Finalizar Orden"}
                      </button>
                    </div>
                  </form>
                </AccordionStep>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <OrderSummary cart={cart} store={store} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
