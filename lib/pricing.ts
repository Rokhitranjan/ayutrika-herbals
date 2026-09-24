import { Coupon } from "./types";

export interface ShippingConfig {
  freeShippingThreshold: number;
  standardFee: number;
  expressFee: number;
}

export interface TaxConfig {
  enabled: boolean;
  ratePercent: number; // e.g., 0 if not configured or inclusive
  label: string;
}

// Configurable business defaults
export const DEFAULT_SHIPPING_CONFIG: ShippingConfig = {
  freeShippingThreshold: 1000,
  standardFee: 99,
  expressFee: 150,
};

export const DEFAULT_TAX_CONFIG: TaxConfig = {
  enabled: false, // Do not invent arbitrary tax rates; configurable by admin
  ratePercent: 0,
  label: "Tax Included",
};

/**
 * Authoritative shipping calculation service
 */
export function calculateShippingFee(
  subtotal: number,
  method: "standard" | "express" = "standard",
  config: ShippingConfig = DEFAULT_SHIPPING_CONFIG
): number {
  if (method === "express") {
    return config.expressFee;
  }
  if (subtotal >= config.freeShippingThreshold || subtotal === 0) {
    return 0;
  }
  return config.standardFee;
}

/**
 * Authoritative tax calculation service
 */
export function calculateTax(
  amountAfterDiscount: number,
  config: TaxConfig = DEFAULT_TAX_CONFIG
): { taxAmount: number; label: string } {
  if (!config.enabled || config.ratePercent <= 0) {
    return { taxAmount: 0, label: config.label };
  }
  const taxAmount = Math.round((amountAfterDiscount * config.ratePercent) / 100);
  return { taxAmount, label: `${config.label} (${config.ratePercent}%)` };
}

/**
 * Authoritative total calculations
 */
export function calculateAuthoritativeTotals(params: {
  items: { price: number; quantity: number }[];
  shippingMethod?: "standard" | "express";
  coupon?: Coupon | { code: string; discountAmount: number } | null;
  shippingConfig?: ShippingConfig;
  taxConfig?: TaxConfig;
}) {
  const { items, shippingMethod = "standard", coupon, shippingConfig, taxConfig } = params;

  // 1. Authoritative Subtotal
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 2. Authoritative Coupon Discount
  let discount = 0;
  if (coupon) {
    if ("discountAmount" in coupon) {
      discount = Number(coupon.discountAmount) || 0;
    } else if ((coupon as Coupon).isActive !== false) {
      const minOrder = (coupon as Coupon).minOrderValue || 0;
      if (subtotal >= minOrder) {
        if ((coupon as Coupon).discountType === "percentage") {
          discount = Math.round((subtotal * (coupon as Coupon).discountValue) / 100);
          if ((coupon as Coupon).maxDiscount && discount > (coupon as Coupon).maxDiscount!) {
            discount = (coupon as Coupon).maxDiscount!;
          }
        } else {
          discount = (coupon as Coupon).discountValue || 0;
        }
      }
    }
  }

  const afterDiscount = Math.max(0, subtotal - discount);

  // 3. Authoritative Shipping
  const shippingFee = calculateShippingFee(subtotal, shippingMethod, shippingConfig);

  // 4. Authoritative Tax
  const { taxAmount, label: taxLabel } = calculateTax(afterDiscount, taxConfig);

  // 5. Authoritative Grand Total in INR
  const total = Math.max(0, afterDiscount + shippingFee + taxAmount);

  return {
    subtotal,
    discount,
    afterDiscount,
    shippingFee,
    shippingAmount: shippingFee,
    taxAmount,
    taxLabel,
    total,
    totalAmount: total,
    currency: "INR",
  };
}
