"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Truck,
  ArrowRight,
  ArrowLeft,
  Lock,
  Sparkles,
  ShoppingBag,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  XCircle,
  RotateCcw,
  Check,
  Tag,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { formatPrice } from "@/lib/utils";
import { Address } from "@/lib/types";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutClient() {
  const router = useRouter();
  const {
    cart,
    subtotal,
    discount,
    shippingFee,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    refreshCart,
  } = useCart();
  const { user, isAuthenticated, loading: authLoading, openSignInModal } = useCustomerAuth();

  // Address state
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);

  // Customer & Shipping Form
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400001",
    country: "India",
    shippingMethod: "standard", // "standard" | "express"
    paymentMethod: "razorpay", // "razorpay" | "cod"
    notes: "",
  });

  const [saveToAccount, setSaveToAccount] = useState(true);
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Order processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Sync authenticated user info into form
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: prev.firstName || user.firstName || user.name.split(" ")[0] || "",
        lastName: prev.lastName || user.lastName || user.name.split(" ").slice(1).join(" ") || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
      }));
      loadSavedAddresses();
    }
  }, [user]);

  // Load saved addresses for authenticated customer
  const loadSavedAddresses = useCallback(async () => {
    try {
      setAddressLoading(true);
      const res = await fetch("/api/account/addresses");
      if (res.ok) {
        const data: Address[] = await res.json();
        setSavedAddresses(data);
        if (data.length > 0) {
          const defaultAddr = data.find((a) => a.isDefault) || data[0];
          setSelectedAddressId(defaultAddr.id);
          populateFormFromAddress(defaultAddr);
        } else {
          setIsAddingNewAddress(true);
        }
      }
    } catch {
      // Graceful fallback
    } finally {
      setAddressLoading(false);
    }
  }, []);

  const populateFormFromAddress = (addr: Address) => {
    setFormData((prev) => ({
      ...prev,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || "",
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country || "India",
      phone: prev.phone || addr.phone,
    }));
  };

  const handleSelectSavedAddress = (addr: Address) => {
    setSelectedAddressId(addr.id);
    setIsAddingNewAddress(false);
    setEditingAddressId(null);
    populateFormFromAddress(addr);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // Client-side address & contact validation before API dispatch
  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) errors.firstName = "First name is required.";
    if (!formData.email.trim() || !formData.email.includes("@")) {
      errors.email = "Valid patron email is required.";
    }
    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      errors.phone = "Valid 10-digit telephone number required.";
    }

    if (!formData.addressLine1.trim()) errors.addressLine1 = "Street address is required.";
    if (!formData.city.trim()) errors.city = "City is required.";
    if (!formData.state.trim()) errors.state = "State is required.";

    const cleanPin = formData.postalCode.trim();
    if (!/^[1-9][0-9]{5}$/.test(cleanPin)) {
      errors.postalCode = "Valid 6-digit Indian PIN code required.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Coupon handling
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsApplyingCoupon(true);
    setCouponError("");
    setCouponSuccess("");

    try {
      const res = await applyCoupon(couponInput.trim());
      if (res.success) {
        setCouponSuccess(res.message);
        setCouponInput("");
      } else {
        setCouponError(res.message);
      }
    } catch {
      setCouponError("Failed to apply promotion code.");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  // Load Razorpay official checkout SDK
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Final Order Placement & Payment Flow
  const handlePlaceOrder = async () => {
    setPaymentError(null);

    // 1. Authenticate check
    if (!isAuthenticated) {
      openSignInModal("Please sign in to your patron account to finalize your order.");
      return;
    }

    // 2. Validate Form
    if (!validateForm()) {
      window.scrollTo({ top: 120, behavior: "smooth" });
      return;
    }

    setIsProcessing(true);

    try {
      const fullShippingAddress = {
        fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
        phone: formData.phone.trim(),
        addressLine1: formData.addressLine1.trim(),
        addressLine2: formData.addressLine2.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        postalCode: formData.postalCode.trim(),
        country: formData.country.trim() || "India",
      };

      // Optionally save new address to account
      if (saveToAccount && isAddingNewAddress) {
        fetch("/api/account/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fullShippingAddress),
        }).catch(() => {});
      }

      // Check if Cash on Delivery
      if (formData.paymentMethod === "cod") {
        const res = await fetch("/api/checkout/place-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            shippingAddress: fullShippingAddress,
            shippingMethod: formData.shippingMethod,
            couponCode: appliedCoupon?.code,
            items: cart.map((it) => ({
              productId: it.product.id,
              productName: it.product.name,
              price: it.product.price,
              quantity: it.quantity,
              productImage: it.product.images?.[0] || it.product.thumbnail,
              sku: it.product.sku,
            })),
            paymentMethod: "Cash on Delivery",
            customerNotes: formData.notes,
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          await refreshCart();
          router.push(`/order-success/${data.orderNumber}`);
        } else {
          setPaymentError(data.error || "Order placement failed. Please verify your address.");
        }
        setIsProcessing(false);
        return;
      }

      // Online Payment via Razorpay
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        setPaymentError("Unable to initialize secure Razorpay gateway. Please check your internet connection.");
        setIsProcessing(false);
        return;
      }

      // 1. Create Server Razorpay Order (Authoritative)
      const createOrderRes = await fetch("/api/checkout/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingAddress: fullShippingAddress,
          shippingMethod: formData.shippingMethod,
          couponCode: appliedCoupon?.code,
          items: cart.map((it) => ({
            productId: it.product.id,
            productName: it.product.name,
            price: it.product.price,
            quantity: it.quantity,
            productImage: it.product.images?.[0] || it.product.thumbnail,
            sku: it.product.sku,
          })),
          customerNotes: formData.notes,
        }),
      });

      const serverOrderData = await createOrderRes.json();
      if (!createOrderRes.ok || !serverOrderData.success) {
        setPaymentError(
          serverOrderData.error ||
            "Unable to reserve botanical formulations. Some items may have limited stock."
        );
        setIsProcessing(false);
        return;
      }

      // 2. Open Razorpay Checkout modal
      const options = {
        key: serverOrderData.keyId,
        amount: serverOrderData.amount,
        currency: serverOrderData.currency || "INR",
        name: "Ayutrika Herbals",
        description: "Pure Luxury Botanical Formulations",
        image: "/logo.png",
        order_id: serverOrderData.razorpayOrderId,
        prefill: {
          name: serverOrderData.customer?.name || fullShippingAddress.fullName,
          email: serverOrderData.customer?.email || formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#10261C",
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            // Graceful cancellation: preserve cart, stay on checkout
          },
        },
        handler: async (response: any) => {
          setIsProcessing(true);
          try {
            // 3. Cryptographic Signature Verification Server-side
            const verifyRes = await fetch("/api/checkout/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                shippingAddress: fullShippingAddress,
                shippingMethod: formData.shippingMethod,
                couponCode: appliedCoupon?.code,
                items: cart.map((it) => ({
                  productId: it.product.id,
                  productName: it.product.name,
                  price: it.product.price,
                  quantity: it.quantity,
                  productImage: it.product.images?.[0] || it.product.thumbnail,
                  sku: it.product.sku,
                })),
                customerNotes: formData.notes,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              await refreshCart();
              router.push(`/order-success/${verifyData.orderNumber}`);
            } else {
              setPaymentError(
                verifyData.error ||
                  "Payment signature verification failed. Please contact apothecary support."
              );
              setIsProcessing(false);
            }
          } catch {
            setPaymentError(
              "Network interruption during payment confirmation. Please verify your bank statement."
            );
            setIsProcessing(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (failedRes: any) => {
        setIsProcessing(false);
        setPaymentError(
          failedRes.error?.description ||
            "PAYMENT COULD NOT BE COMPLETED. Your cart has been preserved."
        );
      });
      rzp.open();
    } catch (err: any) {
      setPaymentError(err?.message || "An unexpected error occurred during checkout.");
      setIsProcessing(false);
    }
  };

  // If cart is empty
  if (cart.length === 0) {
    return (
      <div className="bg-forest-950 text-ivory-100 min-h-screen py-24 px-4 text-center">
        <div className="max-w-md mx-auto bg-forest-900/40 border border-forest-850 p-8 rounded-luxury shadow-luxury">
          <ShoppingBag className="w-12 h-12 text-gold-400 mx-auto mb-4 stroke-1" />
          <h2 className="font-serif text-2xl mb-2 text-ivory-100">Your Botanical Bag is Empty</h2>
          <p className="text-xs text-ivory-400 mb-6 font-sans">
            Please select pure Ayurvedic preparations from our apothecary before proceeding to checkout.
          </p>
          <Link
            href="/shop"
            className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-xs uppercase tracking-widest rounded-luxury font-sans inline-block transition-all shadow-gold-glow"
          >
            Explore Apothecary
          </Link>
        </div>
      </div>
    );
  }

  const effectiveShipping =
    formData.shippingMethod === "express"
      ? 150
      : subtotal >= 1000
      ? 0
      : 99;

  const estimatedTax = 0; // Configurable tax structure without fabricated rate
  const authoritativeGrandTotal = Math.max(0, subtotal - discount + effectiveShipping + estimatedTax);

  return (
    <div className="bg-forest-950 text-ivory-100 min-h-screen">
      {/* Distraction-Free Luxury Header */}
      <header className="border-b border-forest-850 bg-forest-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="font-serif text-xl sm:text-2xl text-ivory-100 tracking-[0.2em] uppercase font-light">
              AYUTRIKA
            </span>
            <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans border-l border-gold-500/40 pl-2">
              APOTHECARY
            </span>
          </Link>

          <div className="flex items-center space-x-4 text-xs font-sans text-ivory-300">
            <div className="hidden sm:flex items-center space-x-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>256-Bit Encrypted Checkout</span>
            </div>
            <Link
              href="/cart"
              className="text-gold-400 hover:text-gold-300 text-xs uppercase tracking-widest flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Edit Cart</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Checkout Container */}
      <main className="max-w-6xl mx-auto py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        {/* Payment Error Alert with Failure Recovery (Section 19) */}
        {paymentError && (
          <div className="mb-8 p-6 bg-red-950/70 border border-red-800/80 rounded-luxury text-left shadow-2xl">
            <div className="flex items-start space-x-3">
              <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-serif text-lg text-ivory-100 uppercase tracking-wide">
                  PAYMENT COULD NOT BE COMPLETED
                </h3>
                <p className="text-xs text-red-200 font-sans leading-relaxed">
                  {paymentError}
                </p>
                <p className="text-xs text-ivory-300 font-sans">
                  Your cart formulations have been preserved. You may try again or select a different payment option.
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={handlePlaceOrder}
                    className="px-5 py-2 bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-xs uppercase tracking-wider rounded font-sans transition-all flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Try Again</span>
                  </button>
                  <Link
                    href="/cart"
                    className="px-5 py-2 border border-forest-750 hover:bg-forest-900 text-ivory-200 text-xs uppercase tracking-wider rounded font-sans transition-all"
                  >
                    Return to Cart
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Guest Authentication Wall */}
        {!authLoading && !isAuthenticated && (
          <div className="mb-10 p-8 bg-forest-900/50 border border-gold-500/40 rounded-luxury text-center shadow-luxury">
            <Lock className="w-8 h-8 text-gold-400 mx-auto mb-3 stroke-1" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold block mb-1">
              PATRON VERIFICATION
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-ivory-100 uppercase tracking-wide mb-2">
              SIGN IN TO CONTINUE
            </h2>
            <p className="text-xs text-ivory-300 font-sans max-w-md mx-auto leading-relaxed mb-6">
              Please authenticate with your patron account to verify your delivery sanctuary, preserve your order history, and access insured payment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => openSignInModal("Sign in to your patron account to complete checkout.")}
                className="px-8 py-3.5 bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-xs uppercase tracking-widest font-sans rounded-luxury transition-all shadow-gold-glow"
              >
                Sign In
              </button>
              <Link
                href="/account/register?redirect=/checkout"
                className="px-8 py-3.5 bg-forest-950 hover:bg-forest-850 border border-forest-750 text-ivory-200 text-xs uppercase tracking-widest font-sans rounded-luxury transition-all"
              >
                Create Account
              </Link>
            </div>
            <p className="text-[11px] text-ivory-400 font-sans mt-4">
              Your bag items are securely preserved during login.
            </p>
          </div>
        )}

        {/* 2-Column Responsive Layout: Left Info, Right Summary (Section 2) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT COLUMN: Customer & Shipping Information (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Patron Information */}
            <div className="p-6 sm:p-8 bg-forest-900/40 border border-forest-800 rounded-luxury space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-forest-850">
                <h2 className="font-serif text-xl text-ivory-100 uppercase tracking-wide">
                  1. Patron Contact Information
                </h2>
                {isAuthenticated && (
                  <span className="text-[11px] text-gold-400 font-sans font-medium">
                    Signed in as {user?.email}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="e.g. Radhika"
                    className={`w-full bg-forest-950 border ${
                      formErrors.firstName ? "border-red-500" : "border-forest-750"
                    } rounded px-3.5 py-2.5 text-xs text-ivory-100 focus:border-gold-400 outline-none`}
                  />
                  {formErrors.firstName && (
                    <p className="text-[10px] text-red-400 mt-1">{formErrors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="e.g. Mehra"
                    className="w-full bg-forest-950 border border-forest-750 rounded px-3.5 py-2.5 text-xs text-ivory-100 focus:border-gold-400 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. radhika@example.com"
                    className={`w-full bg-forest-950 border ${
                      formErrors.email ? "border-red-500" : "border-forest-750"
                    } rounded px-3.5 py-2.5 text-xs text-ivory-100 focus:border-gold-400 outline-none`}
                  />
                  {formErrors.email && (
                    <p className="text-[10px] text-red-400 mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 9820144552"
                    className={`w-full bg-forest-950 border ${
                      formErrors.phone ? "border-red-500" : "border-forest-750"
                    } rounded px-3.5 py-2.5 text-xs text-ivory-100 focus:border-gold-400 outline-none`}
                  />
                  {formErrors.phone && (
                    <p className="text-[10px] text-red-400 mt-1">{formErrors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Shipping Address (Section 5) */}
            <div className="p-6 sm:p-8 bg-forest-900/40 border border-forest-800 rounded-luxury space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-forest-850">
                <h2 className="font-serif text-xl text-ivory-100 uppercase tracking-wide">
                  2. Delivery Address
                </h2>
                {savedAddresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNewAddress(!isAddingNewAddress);
                      setSelectedAddressId(null);
                    }}
                    className="text-xs uppercase tracking-wider text-gold-400 hover:text-gold-300 font-sans flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAddingNewAddress ? "Use Saved Address" : "Add New Address"}</span>
                  </button>
                )}
              </div>

              {/* Saved Address Cards Selection */}
              {isAuthenticated && savedAddresses.length > 0 && !isAddingNewAddress && (
                <div className="space-y-3">
                  <span className="text-[10px] uppercase tracking-wider text-ivory-400 block font-sans">
                    Select Delivery Address:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => handleSelectSavedAddress(addr)}
                        className={`p-4 rounded-luxury border cursor-pointer transition-all text-xs font-sans relative ${
                          selectedAddressId === addr.id
                            ? "bg-forest-900 border-gold-500 shadow-gold-glow"
                            : "bg-forest-950 border-forest-800 hover:border-forest-750"
                        }`}
                      >
                        {selectedAddressId === addr.id && (
                          <div className="absolute top-3 right-3 text-gold-400">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        )}
                        <p className="font-bold text-ivory-100 mb-1">{addr.fullName}</p>
                        <p className="text-ivory-300 text-[11px] leading-relaxed line-clamp-2">
                          {addr.addressLine1}
                          {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                        </p>
                        <p className="text-ivory-400 text-[11px] mt-1">
                          {addr.city}, {addr.state} - {addr.postalCode}
                        </p>
                        <p className="text-ivory-400 text-[10px] mt-1">Phone: {addr.phone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Address Form Fields */}
              {(isAddingNewAddress || savedAddresses.length === 0) && (
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                      Street Address / House No / Landmark *
                    </label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                      placeholder="e.g. Flat 402, Lotus Heritage, 14th Road"
                      className={`w-full bg-forest-950 border ${
                        formErrors.addressLine1 ? "border-red-500" : "border-forest-750"
                      } rounded px-3.5 py-2.5 text-xs text-ivory-100 focus:border-gold-400 outline-none`}
                    />
                    {formErrors.addressLine1 && (
                      <p className="text-[10px] text-red-400 mt-1">{formErrors.addressLine1}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                      Apartment / Suite / Additional Locality
                    </label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleInputChange}
                      placeholder="e.g. Near Khar Gymkhana, Khar West"
                      className="w-full bg-forest-950 border border-forest-750 rounded px-3.5 py-2.5 text-xs text-ivory-100 focus:border-gold-400 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Mumbai"
                        className={`w-full bg-forest-950 border ${
                          formErrors.city ? "border-red-500" : "border-forest-750"
                        } rounded px-3.5 py-2.5 text-xs text-ivory-100 focus:border-gold-400 outline-none`}
                      />
                      {formErrors.city && (
                        <p className="text-[10px] text-red-400 mt-1">{formErrors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="e.g. Maharashtra"
                        className={`w-full bg-forest-950 border ${
                          formErrors.state ? "border-red-500" : "border-forest-750"
                        } rounded px-3.5 py-2.5 text-xs text-ivory-100 focus:border-gold-400 outline-none`}
                      />
                      {formErrors.state && (
                        <p className="text-[10px] text-red-400 mt-1">{formErrors.state}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                        Postal PIN Code *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        maxLength={6}
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="e.g. 400052"
                        className={`w-full bg-forest-950 border ${
                          formErrors.postalCode ? "border-red-500" : "border-forest-750"
                        } rounded px-3.5 py-2.5 text-xs text-ivory-100 focus:border-gold-400 outline-none`}
                      />
                      {formErrors.postalCode && (
                        <p className="text-[10px] text-red-400 mt-1">{formErrors.postalCode}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="checkbox"
                      id="saveAddress"
                      checked={saveToAccount}
                      onChange={(e) => setSaveToAccount(e.target.checked)}
                      className="rounded border-forest-750 bg-forest-950 text-gold-500 focus:ring-0"
                    />
                    <label htmlFor="saveAddress" className="text-xs text-ivory-300 font-sans cursor-pointer">
                      Save this address to my account for future orders
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Delivery Method Selection */}
            <div className="p-6 sm:p-8 bg-forest-900/40 border border-forest-800 rounded-luxury space-y-4">
              <h2 className="font-serif text-xl text-ivory-100 uppercase tracking-wide pb-3 border-b border-forest-850">
                3. Fulfillment Method
              </h2>

              <div className="space-y-3 text-xs font-sans">
                <label
                  className={`flex items-center justify-between p-4 rounded-luxury border cursor-pointer transition-all ${
                    formData.shippingMethod === "standard"
                      ? "bg-forest-900 border-gold-500"
                      : "bg-forest-950 border-forest-800"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="standard"
                      checked={formData.shippingMethod === "standard"}
                      onChange={handleInputChange}
                      className="text-gold-500 focus:ring-0"
                    />
                    <div>
                      <p className="font-bold text-ivory-100">Standard Insured Delivery (3–5 Days)</p>
                      <p className="text-[11px] text-ivory-400">
                        Complimentary on orders above ₹1,000 across India.
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-gold-400">
                    {subtotal >= 1000 ? "FREE" : "₹99"}
                  </span>
                </label>

                <label
                  className={`flex items-center justify-between p-4 rounded-luxury border cursor-pointer transition-all ${
                    formData.shippingMethod === "express"
                      ? "bg-forest-900 border-gold-500"
                      : "bg-forest-950 border-forest-800"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="express"
                      checked={formData.shippingMethod === "express"}
                      onChange={handleInputChange}
                      className="text-gold-500 focus:ring-0"
                    />
                    <div>
                      <p className="font-bold text-ivory-100">Priority Cold-Chain Express (1–2 Days)</p>
                      <p className="text-[11px] text-ivory-400">
                        Temperature-stabilized direct dispatch for sensitive botanical tinctures.
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-gold-400">₹150</span>
                </label>
              </div>
            </div>

            {/* 4. Payment Selection (Section 12) */}
            <div className="p-6 sm:p-8 bg-forest-900/40 border border-forest-800 rounded-luxury space-y-4">
              <h2 className="font-serif text-xl text-ivory-100 uppercase tracking-wide pb-3 border-b border-forest-850">
                4. Payment Selection
              </h2>

              <div className="space-y-3 text-xs font-sans">
                {/* Razorpay Online */}
                <label
                  className={`flex items-start justify-between p-4 rounded-luxury border cursor-pointer transition-all ${
                    formData.paymentMethod === "razorpay"
                      ? "bg-forest-900 border-gold-500 shadow-gold-glow"
                      : "bg-forest-950 border-forest-800"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={formData.paymentMethod === "razorpay"}
                      onChange={handleInputChange}
                      className="mt-0.5 text-gold-500 focus:ring-0"
                    />
                    <div>
                      <p className="font-bold text-ivory-100 flex items-center space-x-2">
                        <span>Razorpay Online Gateway (Instant & Insured)</span>
                        <span className="px-2 py-0.5 text-[9px] bg-gold-500/20 text-gold-400 border border-gold-500/30 rounded uppercase font-semibold">
                          Recommended
                        </span>
                      </p>
                      <p className="text-[11px] text-ivory-400 mt-1">
                        UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards, NetBanking, and Wallets.
                      </p>
                    </div>
                  </div>
                  <CreditCard className="w-5 h-5 text-gold-400 flex-shrink-0" />
                </label>

                {/* Cash on Delivery */}
                <label
                  className={`flex items-start justify-between p-4 rounded-luxury border cursor-pointer transition-all ${
                    formData.paymentMethod === "cod"
                      ? "bg-forest-900 border-gold-500"
                      : "bg-forest-950 border-forest-800"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={handleInputChange}
                      className="mt-0.5 text-gold-500 focus:ring-0"
                    />
                    <div>
                      <p className="font-bold text-ivory-100">Cash on Delivery (Pay on Receipt)</p>
                      <p className="text-[11px] text-ivory-400 mt-1">
                        Settle by cash or digital UPI scan directly with Delhivery courier upon package arrival.
                      </p>
                    </div>
                  </div>
                  <Truck className="w-5 h-5 text-gold-400 flex-shrink-0" />
                </label>
              </div>

              {/* Special Delivery Notes */}
              <div className="pt-2">
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                  Apothecary Packaging Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="e.g. Leave with building security if unavailable."
                  className="w-full bg-forest-950 border border-forest-750 rounded px-3 py-2 text-xs text-ivory-100 focus:border-gold-400 outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Order Summary & Place Order (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 bg-forest-900/50 border border-forest-800 rounded-luxury sticky top-28 shadow-2xl">
              <h2 className="font-serif text-xl text-ivory-100 uppercase tracking-wide pb-4 border-b border-forest-850 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs text-ivory-400 font-sans font-normal">
                  {cart.length} formulation{cart.length > 1 ? "s" : ""}
                </span>
              </h2>

              {/* Product Items List (Section 7) */}
              <div className="divide-y divide-forest-850/60 max-h-72 overflow-y-auto pr-1 custom-gold-scrollbar">
                {cart.map((item) => (
                  <div key={item.product.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-forest-950 border border-forest-800 rounded relative overflow-hidden flex-shrink-0">
                        {item.product.images?.[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <ShoppingBag className="w-5 h-5 text-gold-400 absolute inset-0 m-auto stroke-1" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-serif text-xs text-ivory-100 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <p className="text-[11px] text-ivory-400 font-sans">
                          Qty: {item.quantity} × {formatPrice(item.product.price)}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold font-sans text-ivory-100">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Code Input (Section 10) */}
              <div className="pt-4 border-t border-forest-850">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-950/40 border border-emerald-800 rounded text-xs font-sans text-emerald-300">
                    <div className="flex items-center space-x-2">
                      <Tag className="w-3.5 h-3.5 text-emerald-400" />
                      <span>
                        Promo <strong>{appliedCoupon.code}</strong> Applied (-{formatPrice(discount)})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-ivory-400 hover:text-red-400 text-xs uppercase tracking-wider"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-1">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="COUPON CODE (e.g. VEDA15)"
                        className="flex-1 bg-forest-950 border border-forest-750 rounded px-3 py-2 text-xs text-ivory-100 placeholder:text-ivory-500 uppercase tracking-wider focus:border-gold-400 outline-none"
                      />
                      <button
                        type="submit"
                        disabled={isApplyingCoupon || !couponInput.trim()}
                        className="px-4 py-2 bg-forest-850 hover:bg-forest-800 text-gold-400 font-bold text-xs uppercase tracking-wider rounded font-sans transition-all disabled:opacity-50"
                      >
                        {isApplyingCoupon ? "..." : "Apply"}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[10px] text-red-400 font-sans">{couponError}</p>
                    )}
                    {couponSuccess && (
                      <p className="text-[10px] text-emerald-400 font-sans">{couponSuccess}</p>
                    )}
                  </form>
                )}
              </div>

              {/* Calculation Totals (Section 7) */}
              <div className="pt-4 border-t border-forest-850 space-y-2 text-xs font-sans">
                <div className="flex justify-between text-ivory-400">
                  <span>Subtotal:</span>
                  <span className="text-ivory-200">{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Botanical Discount:</span>
                    <span>- {formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-ivory-400">
                  <span>Shipping:</span>
                  <span className="text-ivory-200">
                    {effectiveShipping === 0 ? "FREE" : formatPrice(effectiveShipping)}
                  </span>
                </div>

                <div className="flex justify-between pt-3 border-t border-forest-800 text-sm font-bold">
                  <span className="text-ivory-100">Grand Total:</span>
                  <span className="text-gold-400 text-lg">
                    {formatPrice(authoritativeGrandTotal)}
                  </span>
                </div>
              </div>

              {/* Place Order CTA (Section 11) */}
              <div className="pt-6">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handlePlaceOrder}
                  className="w-full py-4 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-forest-950 font-bold text-xs uppercase tracking-[0.2em] font-sans rounded-luxury transition-all shadow-gold-glow flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <span>Securing Authorization...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>
                        {formData.paymentMethod === "cod"
                          ? "Place Order (Cash on Delivery)"
                          : "Place Order / Pay Online"}
                      </span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-forest-850 text-center">
                <p className="text-[10px] text-ivory-400 font-sans leading-relaxed">
                  ✓ Complimentary insured packaging • Batch heavy-metal verified • 100% botanical potency guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
