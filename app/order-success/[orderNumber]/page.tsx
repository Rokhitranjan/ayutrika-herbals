import { getOrderByNumber, getOrderById } from "@/lib/data/store";
import { notFound } from "next/navigation";
import OrderSuccessClient from "./OrderSuccessClient";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: { orderNumber: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Order Confirmed #${params.orderNumber} | Ayutrika Herbals`,
    description: "Thank you for your Ayutrika Herbals botanical order. Your pure formulations are being prepared.",
  };
}

export default async function OrderSuccessPage({ params }: Props) {
  let order = await getOrderByNumber(params.orderNumber);
  if (!order) {
    order = await getOrderById(params.orderNumber);
  }

  if (!order) {
    notFound();
  }

  return <OrderSuccessClient order={order} />;
}
