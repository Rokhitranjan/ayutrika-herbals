import { getCustomerSession } from "@/lib/auth";
import { getUserOrders } from "@/lib/data/store";
import { redirect } from "next/navigation";
import CustomerOrdersClient from "@/components/account/CustomerOrdersClient";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Orders | Ayutrika Herbals",
  description: "View and track all your previous herbal formulation orders with live fulfillment status.",
};

export default async function OrdersHistoryPage() {
  const session = await getCustomerSession();
  if (!session) {
    redirect("/account/login?redirect=/account/orders");
  }

  // Scoped strictly to authenticated customer
  const orders = await getUserOrders(session.userId, session.email);

  return (
    <div className="bg-forest-950 text-ivory-100 min-h-screen py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <CustomerOrdersClient initialOrders={orders} />
      </div>
    </div>
  );
}
