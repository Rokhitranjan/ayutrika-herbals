import CheckoutClient from "@/components/checkout/CheckoutClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Checkout | Ayutrika Herbals",
  description: "Complete your Ayutrika Herbals order with encrypted payment and complimentary insured delivery across India.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
