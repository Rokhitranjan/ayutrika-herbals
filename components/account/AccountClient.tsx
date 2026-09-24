"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  Package,
  Heart,
  LogOut,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Lock,
  Phone,
  Mail,
  Home,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { Order, Address, Product } from "@/lib/types";
import { formatPrice, formatDate } from "@/lib/utils";

type AccountTab = "profile" | "orders" | "wishlist" | "addresses" | "security";

interface AccountClientProps {
  initialTab?: AccountTab;
}

export default function AccountClient({ initialTab }: AccountClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlTab = searchParams.get("tab") as AccountTab;
  const { toast } = useToast();

  const {
    user,
    logout,
    isAuthenticated,
    loading: authLoading,
    updateProfile,
    changePassword,
  } = useCustomerAuth();

  const { wishlist, removeFromWishlist, loading: wishlistLoading } = useWishlist();
  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState<AccountTab>(initialTab || urlTab || "profile");

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Addresses State
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefault: false,
  });
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressError, setAddressError] = useState("");

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Security (Change Password) Form State
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [securitySaving, setSecuritySaving] = useState(false);
  const [securityMessage, setSecurityMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Synchronize Tab with URL query if present
  useEffect(() => {
    if (urlTab && ["profile", "orders", "wishlist", "addresses", "security"].includes(urlTab)) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  // Sync profile form when user updates
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || user.name.split(" ")[0] || "",
        lastName: user.lastName || user.name.split(" ").slice(1).join(" ") || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  // Load Orders
  useEffect(() => {
    if (!isAuthenticated) return;
    async function loadOrders() {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (Array.isArray(data)) {
          if (user?.email) {
            const userOrders = data.filter(
              (o) => o.customerEmail?.toLowerCase() === user.email.toLowerCase()
            );
            setOrders(userOrders.length > 0 ? userOrders : data);
          } else {
            setOrders(data);
          }
        }
      } catch {
        // Fallback
      } finally {
        setOrdersLoading(false);
      }
    }
    loadOrders();
  }, [isAuthenticated, user?.email]);

  // Load Addresses
  const fetchAddresses = async () => {
    try {
      setAddressesLoading(true);
      const res = await fetch("/api/account/addresses");
      if (res.ok) {
        const data = await res.json();
        setAddresses(Array.isArray(data) ? data : []);
      }
    } catch {
      // Fallback
    } finally {
      setAddressesLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses();
    }
  }, [isAuthenticated]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/account");
    }
  }, [authLoading, isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
    toast.info("You have signed out of your account.");
    router.push("/");
  };

  // Profile Save
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);
    setProfileSaving(true);

    const result = await updateProfile({
      firstName: profileForm.firstName.trim(),
      lastName: profileForm.lastName.trim(),
      phone: profileForm.phone.trim(),
      email: profileForm.email.trim(),
    });

    setProfileSaving(false);

    if (result.success) {
      setProfileMessage({ type: "success", text: "Profile details updated successfully." });
      toast.success("✓ Profile updated");
    } else {
      setProfileMessage({ type: "error", text: result.message || "Failed to update profile." });
      toast.error(result.message || "Could not update profile.");
    }
  };

  // Password Change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityMessage(null);

    if (securityForm.newPassword !== securityForm.confirmNewPassword) {
      setSecurityMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    if (securityForm.newPassword.length < 8) {
      setSecurityMessage({ type: "error", text: "New password must be at least 8 characters." });
      return;
    }

    setSecuritySaving(true);
    const result = await changePassword({
      currentPassword: securityForm.currentPassword,
      newPassword: securityForm.newPassword,
      confirmNewPassword: securityForm.confirmNewPassword,
    });
    setSecuritySaving(false);

    if (result.success) {
      setSecurityMessage({ type: "success", text: "Password changed successfully." });
      setSecurityForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
      toast.success("✓ Password updated successfully");
    } else {
      setSecurityMessage({ type: "error", text: result.message || "Password update failed." });
      toast.error(result.message || "Could not change password.");
    }
  };

  // Address Handlers
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      fullName: user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "",
      phone: user?.phone || "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      isDefault: addresses.length === 0,
    });
    setAddressError("");
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr: Address) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      fullName: addr.fullName,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || "",
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country || "India",
      isDefault: addr.isDefault,
    });
    setAddressError("");
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError("");

    // Postal code validation
    const pinRegex = /^[1-9][0-9]{5}$/;
    if (!pinRegex.test(addressForm.postalCode.trim())) {
      setAddressError("Please enter a valid 6-digit Indian PIN code.");
      return;
    }

    setAddressSaving(true);
    try {
      if (editingAddressId) {
        // Update
        const res = await fetch(`/api/account/addresses/${editingAddressId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addressForm),
        });
        const data = await res.json();
        if (res.ok) {
          toast.success("✓ Address saved");
          setIsAddressModalOpen(false);
          fetchAddresses();
        } else {
          setAddressError(data.error || "Failed to update address.");
        }
      } else {
        // Create
        const res = await fetch("/api/account/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addressForm),
        });
        const data = await res.json();
        if (res.ok) {
          toast.success("✓ Address saved");
          setIsAddressModalOpen(false);
          fetchAddresses();
        } else {
          setAddressError(data.error || "Failed to save address.");
        }
      }
    } catch {
      setAddressError("Network error while saving address.");
    } finally {
      setAddressSaving(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you wish to remove this address?")) return;
    try {
      const res = await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.info("✓ Address removed");
        setAddresses((prev) => prev.filter((a) => a.id !== id));
      } else {
        toast.error("Could not delete address.");
      }
    } catch {
      toast.error("Network error.");
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      const res = await fetch(`/api/account/addresses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setDefault" }),
      });
      if (res.ok) {
        toast.success("✓ Default address updated");
        setAddresses((prev) =>
          prev.map((a) => ({ ...a, isDefault: a.id === id }))
        );
      }
    } catch {
      toast.error("Failed to set default address.");
    }
  };

  // Move wishlist item to cart
  const handleMoveToCart = async (product: Product) => {
    if (product.stock <= 0) {
      toast.error("This formulation is currently out of stock.");
      return;
    }
    const res = await addToCart(product, 1);
    if (res.success) {
      await removeFromWishlist(product.id);
      toast.success(`✓ Moved ${product.name} to Cart`);
    }
  };

  if (authLoading) {
    return (
      <div className="bg-forest-950 text-ivory-100 min-h-screen py-24 px-4 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-gold-400 animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-ivory-300 font-sans">
            Loading patron sanctuary...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !authLoading) {
    return (
      <div className="bg-forest-950 text-ivory-100 min-h-screen py-24 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-forest-900/50 border border-forest-800 p-8 rounded-luxury text-center space-y-4">
          <ShieldCheck className="w-10 h-10 text-gold-400 mx-auto stroke-1" />
          <h2 className="font-serif text-2xl uppercase">Sign In to Continue</h2>
          <p className="text-xs text-ivory-300 font-sans leading-relaxed">
            Please sign in to access your personal Ayutrika Herbals account, addresses, and saved rituals.
          </p>
          <div className="pt-2">
            <Link
              href="/login?redirect=/account"
              className="inline-block w-full py-3 bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-xs uppercase tracking-widest rounded-luxury font-sans shadow-luxury"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-forest-950 text-ivory-100 min-h-screen py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-8 border-b border-forest-850 gap-4 mb-8">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold block mb-1">
              PATRON SANCTUARY
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-ivory-100 uppercase">
              Welcome, {user?.name || user?.firstName || "Esteemed Patron"}
            </h1>
            <p className="text-xs text-ivory-400 font-sans mt-1">
              {user?.email} • Member of the Ayutrika Botanical Circle
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="self-start sm:self-auto flex items-center space-x-2 text-xs uppercase tracking-widest text-ivory-300 hover:text-red-400 font-sans py-2.5 px-4 border border-forest-750 hover:border-red-500/50 rounded-luxury transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>

        {/* 6 Luxury Account Navigation Tabs */}
        <div className="flex overflow-x-auto pb-3 scrollbar-none gap-2 sm:gap-3 border-b border-forest-850/80 mb-10">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center space-x-2 px-5 py-3 rounded-luxury text-xs uppercase tracking-widest font-sans font-medium whitespace-nowrap transition-all ${
              activeTab === "profile"
                ? "bg-gold-500 text-forest-950 shadow-luxury font-bold"
                : "bg-forest-900/40 text-ivory-300 hover:text-gold-400 hover:bg-forest-900/80 border border-forest-800"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center space-x-2 px-5 py-3 rounded-luxury text-xs uppercase tracking-widest font-sans font-medium whitespace-nowrap transition-all ${
              activeTab === "orders"
                ? "bg-gold-500 text-forest-950 shadow-luxury font-bold"
                : "bg-forest-900/40 text-ivory-300 hover:text-gold-400 hover:bg-forest-900/80 border border-forest-800"
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("wishlist")}
            className={`flex items-center space-x-2 px-5 py-3 rounded-luxury text-xs uppercase tracking-widest font-sans font-medium whitespace-nowrap transition-all ${
              activeTab === "wishlist"
                ? "bg-gold-500 text-forest-950 shadow-luxury font-bold"
                : "bg-forest-900/40 text-ivory-300 hover:text-gold-400 hover:bg-forest-900/80 border border-forest-800"
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Wishlist ({wishlist.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`flex items-center space-x-2 px-5 py-3 rounded-luxury text-xs uppercase tracking-widest font-sans font-medium whitespace-nowrap transition-all ${
              activeTab === "addresses"
                ? "bg-gold-500 text-forest-950 shadow-luxury font-bold"
                : "bg-forest-900/40 text-ivory-300 hover:text-gold-400 hover:bg-forest-900/80 border border-forest-800"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Addresses ({addresses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`flex items-center space-x-2 px-5 py-3 rounded-luxury text-xs uppercase tracking-widest font-sans font-medium whitespace-nowrap transition-all ${
              activeTab === "security"
                ? "bg-gold-500 text-forest-950 shadow-luxury font-bold"
                : "bg-forest-900/40 text-ivory-300 hover:text-gold-400 hover:bg-forest-900/80 border border-forest-800"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Security</span>
          </button>
        </div>

        {/* Tab 1: PROFILE SECTION */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            <div className="lg:col-span-8 bg-forest-900/40 border border-forest-800 p-6 sm:p-8 rounded-luxury space-y-6">
              <div>
                <h2 className="font-serif text-2xl text-ivory-100 uppercase tracking-wide">
                  Personal Profile
                </h2>
                <p className="text-xs text-ivory-400 font-sans mt-1">
                  Manage your personal details and contact preferences.
                </p>
              </div>

              {profileMessage && (
                <div
                  className={`p-3.5 rounded-luxury text-xs flex items-center space-x-2.5 font-sans ${
                    profileMessage.type === "success"
                      ? "bg-emerald-950/40 border border-emerald-500/50 text-emerald-200"
                      : "bg-red-950/40 border border-red-500/50 text-red-200"
                  }`}
                >
                  {profileMessage.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  )}
                  <span>{profileMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1.5 font-sans">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                      className="w-full bg-forest-950 border border-forest-750 text-ivory-100 text-xs px-3.5 py-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1.5 font-sans">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                      className="w-full bg-forest-950 border border-forest-750 text-ivory-100 text-xs px-3.5 py-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1.5 font-sans">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gold-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full bg-forest-950 border border-forest-750 text-ivory-100 text-xs pl-10 pr-3.5 py-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1.5 font-sans">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gold-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full bg-forest-950 border border-forest-750 text-ivory-100 text-xs pl-10 pr-3.5 py-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="py-3 px-6 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-forest-950 font-bold text-xs uppercase tracking-widest rounded-luxury font-sans shadow-luxury transition-all flex items-center space-x-2"
                  >
                    {profileSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Profile Changes</span>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Profile Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 bg-forest-900/30 border border-forest-800 rounded-luxury space-y-4 text-xs font-sans">
                <div className="flex items-center space-x-3 pb-3 border-b border-forest-800">
                  <div className="w-10 h-10 rounded-full bg-forest-950 border border-gold-500/50 flex items-center justify-center text-gold-400 font-serif font-bold text-lg">
                    {user?.name?.[0]?.toUpperCase() || "A"}
                  </div>
                  <div>
                    <span className="font-serif text-base text-ivory-100 block font-bold">
                      {user?.name}
                    </span>
                    <span className="text-[11px] text-gold-400 font-medium tracking-wider uppercase">
                      Active Patron Tier
                    </span>
                  </div>
                </div>
                <div className="space-y-2 text-ivory-300">
                  <div className="flex justify-between">
                    <span className="text-ivory-400">Customer ID:</span>
                    <span className="font-mono text-[11px] text-ivory-200">{user?.id?.slice(0, 10)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ivory-400">Total Orders:</span>
                    <span className="text-ivory-100 font-bold">{orders.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ivory-400">Wishlist Items:</span>
                    <span className="text-ivory-100 font-bold">{wishlist.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: ORDERS SECTION */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-forest-850">
              <div>
                <h2 className="font-serif text-2xl text-ivory-100 uppercase tracking-wide">
                  Formulation Orders
                </h2>
                <p className="text-xs text-ivory-400 font-sans mt-0.5">
                  Review historical apothecary requests, fulfillment statuses, and tracking.
                </p>
              </div>
              <Link
                href="/shop"
                className="text-xs uppercase tracking-widest text-gold-400 hover:text-gold-300 font-sans flex items-center gap-1.5"
              >
                <span>Browse Apothecary</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {ordersLoading ? (
              <div className="py-16 text-center text-xs text-ivory-400 font-sans animate-pulse">
                Retrieving your order records...
              </div>
            ) : orders.length === 0 ? (
              <div className="py-16 text-center bg-forest-900/30 border border-forest-850 rounded-luxury p-8">
                <Package className="w-10 h-10 text-gold-400 mx-auto mb-3 stroke-1" />
                <h3 className="font-serif text-xl text-ivory-100 uppercase mb-2">No Orders Yet</h3>
                <p className="text-xs text-ivory-400 font-sans mb-6 max-w-sm mx-auto">
                  Your formulation journey has not yet begun. Browse our classical Ayurvedic preparations to place your first order.
                </p>
                <Link
                  href="/shop"
                  className="px-6 py-3 bg-gold-500 text-forest-950 font-bold text-xs uppercase tracking-widest font-sans rounded-luxury shadow-luxury inline-block"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-6 bg-forest-900/40 border border-forest-850 hover:border-gold-500/50 rounded-luxury transition-all space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-forest-850/80 pb-4 text-xs font-sans">
                      <div>
                        <span className="text-gold-400 font-bold font-sans tracking-wider text-sm block">
                          {order.orderNumber}
                        </span>
                        <span className="text-[11px] text-ivory-400">
                          Placed on {formatDate(order.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-luxury font-sans ${
                            order.orderStatus === "Delivered"
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                              : order.orderStatus === "Shipped" || order.orderStatus === "Out for Delivery"
                              ? "bg-gold-950 text-gold-300 border border-gold-800"
                              : "bg-forest-950 text-ivory-300 border border-forest-800"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                        <span className="font-bold text-ivory-100 text-base">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-ivory-300 font-sans">
                      {order.items.map((it) => (
                        <div key={it.id} className="flex justify-between items-center py-1">
                          <span className="line-clamp-1 max-w-md font-serif text-sm">
                            {it.quantity} × {it.productName}
                          </span>
                          <span className="text-ivory-400 font-sans">{formatPrice(it.total)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-forest-850/60 flex items-center justify-between text-xs font-sans">
                      <span className="text-[11px] text-ivory-400">
                        Payment: {order.paymentMethod} • Status: {order.paymentStatus}
                      </span>
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="text-gold-400 hover:text-gold-300 uppercase tracking-widest font-semibold text-[11px] flex items-center gap-1.5"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: WISHLIST SECTION */}
        {activeTab === "wishlist" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-forest-850">
              <div>
                <h2 className="font-serif text-2xl text-ivory-100 uppercase tracking-wide">
                  Saved Rituals & Formulations
                </h2>
                <p className="text-xs text-ivory-400 font-sans mt-0.5">
                  Your curated collection of botanical therapies.
                </p>
              </div>
              <Link
                href="/wishlist"
                className="text-xs uppercase tracking-widest text-gold-400 hover:text-gold-300 font-sans flex items-center gap-1.5"
              >
                <span>Full Wishlist Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {wishlistLoading ? (
              <div className="py-16 text-center text-xs text-ivory-400 font-sans animate-pulse">
                Loading saved items...
              </div>
            ) : wishlist.length === 0 ? (
              <div className="py-16 text-center bg-forest-900/30 border border-forest-850 rounded-luxury p-8">
                <Heart className="w-10 h-10 text-gold-400 mx-auto mb-3 stroke-1" />
                <h3 className="font-serif text-xl text-ivory-100 uppercase mb-2">
                  Your Wishlist is Empty
                </h3>
                <p className="text-xs text-ivory-400 font-sans mb-6 max-w-sm mx-auto">
                  Click the heart icon on any product to save formulation rituals for later contemplation.
                </p>
                <Link
                  href="/shop"
                  className="px-6 py-3 bg-gold-500 text-forest-950 font-bold text-xs uppercase tracking-widest font-sans rounded-luxury shadow-luxury inline-block"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((product) => {
                  const isOutOfStock = product.stock <= 0;
                  return (
                    <div
                      key={product.id}
                      className="bg-forest-900/40 border border-forest-800 rounded-luxury p-5 flex flex-col justify-between space-y-4 hover:border-gold-500/50 transition-all"
                    >
                      <div className="space-y-3">
                        <div className="relative aspect-square w-full rounded-luxury overflow-hidden bg-forest-950 border border-forest-850">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-forest-750 font-serif">
                              Ayutrika
                            </div>
                          )}
                          {isOutOfStock && (
                            <div className="absolute top-2 right-2 px-2 py-1 bg-red-950/90 border border-red-500/80 text-red-200 text-[9px] uppercase tracking-wider font-sans font-bold rounded-luxury">
                              CURRENTLY UNAVAILABLE
                            </div>
                          )}
                        </div>

                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-gold-400 font-sans block">
                            {product.productType || product.subcategory || "Botanical Formulation"}
                          </span>
                          <h4 className="font-serif text-lg text-ivory-100 font-medium line-clamp-1 mt-0.5">
                            {product.name}
                          </h4>
                          <p className="text-xs text-ivory-400 font-sans line-clamp-2 mt-1">
                            {product.shortDesc || product.fullDesc}
                          </p>
                        </div>

                        <div className="flex items-baseline space-x-2 pt-1 font-sans">
                          <span className="font-serif text-lg font-bold text-ivory-100">
                            {formatPrice(product.price)}
                          </span>
                          {product.compareAtPrice && (
                            <span className="text-xs text-ivory-400 line-through">
                              {formatPrice(product.compareAtPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-forest-850 font-sans text-xs">
                        <button
                          onClick={() => handleMoveToCart(product)}
                          disabled={isOutOfStock}
                          className="w-full py-2.5 bg-gold-500 hover:bg-gold-400 disabled:opacity-40 disabled:hover:bg-gold-500 text-forest-950 font-bold uppercase tracking-wider rounded-luxury transition-all text-[11px]"
                        >
                          {isOutOfStock ? "Out of Stock" : "Move to Cart"}
                        </button>
                        <button
                          onClick={() => removeFromWishlist(product.id)}
                          className="w-full py-2 text-ivory-400 hover:text-red-400 uppercase tracking-widest text-[10px] transition-colors"
                        >
                          Remove from Wishlist
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: ADDRESS BOOK SECTION */}
        {activeTab === "addresses" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-forest-850">
              <div>
                <h2 className="font-serif text-2xl text-ivory-100 uppercase tracking-wide">
                  Address Sanctuary
                </h2>
                <p className="text-xs text-ivory-400 font-sans mt-0.5">
                  Maintain your private shipping and delivery destinations.
                </p>
              </div>
              <button
                onClick={handleOpenAddAddress}
                className="py-2.5 px-4 bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-xs uppercase tracking-widest rounded-luxury font-sans shadow-luxury flex items-center space-x-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            </div>

            {addressesLoading ? (
              <div className="py-16 text-center text-xs text-ivory-400 font-sans animate-pulse">
                Retrieving your address book...
              </div>
            ) : addresses.length === 0 ? (
              <div className="py-16 text-center bg-forest-900/30 border border-forest-850 rounded-luxury p-8">
                <MapPin className="w-10 h-10 text-gold-400 mx-auto mb-3 stroke-1" />
                <h3 className="font-serif text-xl text-ivory-100 uppercase mb-2">
                  No Addresses Registered
                </h3>
                <p className="text-xs text-ivory-400 font-sans mb-6 max-w-sm mx-auto">
                  Add a delivery address to expedite your apothecary formulation checkout.
                </p>
                <button
                  onClick={handleOpenAddAddress}
                  className="px-6 py-3 bg-gold-500 text-forest-950 font-bold text-xs uppercase tracking-widest font-sans rounded-luxury shadow-luxury inline-flex items-center space-x-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Address</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-6 rounded-luxury border transition-all flex flex-col justify-between ${
                      addr.isDefault
                        ? "bg-forest-900/60 border-gold-500/70 shadow-luxury"
                        : "bg-forest-900/40 border-forest-800 hover:border-forest-700"
                    }`}
                  >
                    <div className="space-y-3 font-sans">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-serif text-lg font-bold text-ivory-100 block">
                            {addr.fullName}
                          </span>
                          <span className="text-xs text-gold-400 font-sans">{addr.phone}</span>
                        </div>
                        {addr.isDefault && (
                          <span className="px-2.5 py-1 bg-gold-500/20 border border-gold-500/50 text-gold-300 text-[9px] uppercase tracking-wider font-bold rounded-luxury">
                            Default Address
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-ivory-300 space-y-1 font-light pt-1">
                        <p>{addr.addressLine1}</p>
                        {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                        <p>
                          {addr.city}, {addr.state} - <span className="font-mono text-ivory-200">{addr.postalCode}</span>
                        </p>
                        <p className="text-ivory-400 uppercase text-[11px] tracking-wider">{addr.country}</p>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-forest-850 flex items-center justify-between text-xs font-sans">
                      {!addr.isDefault ? (
                        <button
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="text-[11px] uppercase tracking-wider text-gold-400 hover:text-gold-300 font-semibold"
                        >
                          Set As Default
                        </button>
                      ) : (
                        <span className="text-[11px] text-ivory-400 italic">Primary Destination</span>
                      )}

                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleOpenEditAddress(addr)}
                          className="p-1.5 text-ivory-400 hover:text-ivory-100 transition-colors"
                          title="Edit Address"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="p-1.5 text-ivory-400 hover:text-red-400 transition-colors"
                          title="Delete Address"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Address Modal (Add / Edit) */}
            {isAddressModalOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-forest-950/80 backdrop-blur-sm animate-fade-in">
                <div className="bg-forest-900 border border-forest-800 rounded-luxury max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
                  <div>
                    <h3 className="font-serif text-2xl text-ivory-100 uppercase tracking-wide">
                      {editingAddressId ? "Edit Delivery Address" : "New Delivery Address"}
                    </h3>
                    <p className="text-xs text-ivory-400 font-sans mt-1">
                      Please enter your precise shipping coordinates for insured apothecary dispatch.
                    </p>
                  </div>

                  {addressError && (
                    <div className="p-3 bg-red-950/40 border border-red-500/50 rounded-luxury text-xs text-red-200 flex items-center space-x-2 font-sans">
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <span>{addressError}</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveAddress} className="space-y-4 font-sans text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1">
                          Full Recipient Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={addressForm.fullName}
                          onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                          placeholder="e.g. Radhika Mehra"
                          className="w-full bg-forest-950 border border-forest-750 text-ivory-100 p-3 rounded-luxury focus:outline-none focus:border-gold-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full bg-forest-950 border border-forest-750 text-ivory-100 p-3 rounded-luxury focus:outline-none focus:border-gold-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1">
                        Address Line 1 (Flat, House, Building, Street) *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.addressLine1}
                        onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                        placeholder="e.g. 14B Lotus Villa, Off Link Road"
                        className="w-full bg-forest-950 border border-forest-750 text-ivory-100 p-3 rounded-luxury focus:outline-none focus:border-gold-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1">
                        Address Line 2 (Area, Landmark)
                      </label>
                      <input
                        type="text"
                        value={addressForm.addressLine2}
                        onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                        placeholder="Near Botanical Garden"
                        className="w-full bg-forest-950 border border-forest-750 text-ivory-100 p-3 rounded-luxury focus:outline-none focus:border-gold-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          placeholder="Mumbai"
                          className="w-full bg-forest-950 border border-forest-750 text-ivory-100 p-3 rounded-luxury focus:outline-none focus:border-gold-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1">
                          State *
                        </label>
                        <input
                          type="text"
                          required
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          placeholder="Maharashtra"
                          className="w-full bg-forest-950 border border-forest-750 text-ivory-100 p-3 rounded-luxury focus:outline-none focus:border-gold-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1">
                          PIN Code *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={addressForm.postalCode}
                          onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                          placeholder="400050"
                          className="w-full bg-forest-950 border border-forest-750 text-ivory-100 p-3 rounded-luxury focus:outline-none focus:border-gold-500 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        disabled
                        value={addressForm.country}
                        className="w-full bg-forest-950/60 border border-forest-800 text-ivory-400 p-3 rounded-luxury cursor-not-allowed"
                      />
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={addressForm.isDefault}
                        onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                        className="accent-gold-500 w-4 h-4 rounded"
                      />
                      <label htmlFor="isDefault" className="text-xs text-ivory-200 cursor-pointer">
                        Set as primary delivery address
                      </label>
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-forest-800">
                      <button
                        type="button"
                        onClick={() => setIsAddressModalOpen(false)}
                        className="py-2.5 px-4 text-xs uppercase tracking-wider text-ivory-400 hover:text-ivory-100 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={addressSaving}
                        className="py-2.5 px-6 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-forest-950 font-bold text-xs uppercase tracking-widest rounded-luxury shadow-luxury flex items-center space-x-2"
                      >
                        {addressSaving ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <span>{editingAddressId ? "Save Changes" : "Establish Address"}</span>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: SECURITY SECTION */}
        {activeTab === "security" && (
          <div className="max-w-2xl bg-forest-900/40 border border-forest-800 p-6 sm:p-8 rounded-luxury space-y-6 animate-fade-in">
            <div>
              <h2 className="font-serif text-2xl text-ivory-100 uppercase tracking-wide">
                Account Security & Password
              </h2>
              <p className="text-xs text-ivory-400 font-sans mt-1">
                Maintain authentication credentials for your personal Ayutrika Herbals account.
              </p>
            </div>

            {securityMessage && (
              <div
                className={`p-3.5 rounded-luxury text-xs flex items-center space-x-2.5 font-sans ${
                  securityMessage.type === "success"
                    ? "bg-emerald-950/40 border border-emerald-500/50 text-emerald-200"
                    : "bg-red-950/40 border border-red-500/50 text-red-200"
                }`}
              >
                {securityMessage.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                )}
                <span>{securityMessage.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1.5 font-sans">
                  Current Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gold-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={securityForm.currentPassword}
                    onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-forest-950 border border-forest-750 text-ivory-100 text-xs pl-10 pr-3.5 py-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1.5 font-sans">
                  New Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gold-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={securityForm.newPassword}
                    onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                    placeholder="At least 8 characters"
                    className="w-full bg-forest-950 border border-forest-750 text-ivory-100 text-xs pl-10 pr-3.5 py-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                  />
                </div>
                <p className="text-[10px] text-ivory-400 font-sans mt-1">
                  Must be at least 8 characters with letters and numbers.
                </p>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1.5 font-sans">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gold-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={securityForm.confirmNewPassword}
                    onChange={(e) => setSecurityForm({ ...securityForm, confirmNewPassword: e.target.value })}
                    placeholder="Re-enter new password"
                    className="w-full bg-forest-950 border border-forest-750 text-ivory-100 text-xs pl-10 pr-3.5 py-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={securitySaving}
                  className="py-3 px-6 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-forest-950 font-bold text-xs uppercase tracking-widest rounded-luxury font-sans shadow-luxury transition-all flex items-center space-x-2"
                >
                  {securitySaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Securing...</span>
                    </>
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
