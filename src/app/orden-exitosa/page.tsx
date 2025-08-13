import Layout from "@/components/Layout/Layout";
import OrderSuccess from "@/components/OrderSuccess/OrderSuccess";

export default function OrderSuccessPage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OrderSuccess />
      </div>
    </Layout>
  );
}
