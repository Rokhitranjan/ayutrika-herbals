"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Warehouse,
  Tag,
  Star,
  BookOpen,
  Leaf,
  Sparkles,
  Home,
  BarChart3,
  Settings,
  ShieldCheck,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  CheckCircle2,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: Layers },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Inventory", href: "/admin/inventory", icon: Warehouse },
  { name: "Coupons", href: "/admin/coupons", icon: Tag },
  { name: "Reviews", href: "/admin/reviews", icon: Star },
  { name: "Blog / Journal", href: "/admin/blog", icon: BookOpen },
  { name: "Ingredients", href: "/admin/ingredients", icon: Leaf },
  { name: "Benefits", href: "/admin/benefits", icon: Sparkles },
  { name: "Homepage CMS", href: "/admin/cms", icon: Home },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Brand Settings", href: "/admin/settings", icon: Settings },
  { name: "Admin Users", href: "/admin/users", icon: ShieldCheck },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // Continue
    }
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-charcoal-950 text-ivory-100 flex flex-col md:flex-row font-sans selection:bg-gold-500/30 selection:text-gold-200">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-forest-950 border-b border-forest-800 z-30 sticky top-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded-luxury text-ivory-200 hover:text-gold-400 hover:bg-forest-900 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex flex-col">
            <span className="font-serif tracking-widest text-sm text-gold-400 font-semibold uppercase">
              Ayutrika Herbals
            </span>
            <span className="text-[9px] uppercase tracking-wider text-ivory-400 font-mono">
              Apothecary CMS
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href="/"
            target="_blank"
            className="p-1.5 text-ivory-300 hover:text-gold-400 text-xs flex items-center space-x-1"
            title="View Store"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          <button
            onClick={handleLogout}
            className="p-1.5 text-ivory-300 hover:text-red-400 text-xs"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-forest-950 border-r border-forest-850 flex flex-col transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-forest-850 flex items-center justify-between">
          <div>
            <span className="text-[10px] tracking-[0.25em] text-gold-400 font-semibold uppercase block">
              Ayurvedic Sanctuary
            </span>
            <h2 className="font-serif text-lg tracking-wider text-ivory-100 uppercase font-medium">
              AYUTRIKA HERBALS
            </h2>
            <div className="flex items-center space-x-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-ivory-400 font-mono">Admin Master v2.4</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-gold-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-luxury text-xs font-medium tracking-wide transition-all ${
                  isActive
                    ? "bg-gold-500 text-forest-950 font-semibold shadow-luxury"
                    : "text-ivory-300 hover:text-ivory-100 hover:bg-forest-900/60"
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-forest-950" : "text-gold-400/80"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-forest-850 bg-forest-950/80">
          <div className="flex items-center justify-between mb-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center space-x-2 text-[11px] text-ivory-300 hover:text-gold-400 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
              <span>Visit Live Store</span>
            </Link>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-forest-800 text-gold-300 font-mono">
              Live
            </span>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full py-2 px-3 bg-forest-900 hover:bg-red-950/60 border border-forest-800 hover:border-red-800/80 text-ivory-300 hover:text-red-300 text-xs rounded-luxury transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{loggingOut ? "Signing Out..." : "Sign Out"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-forest-950/90 border-b border-forest-850 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center space-x-4">
            <h1 className="font-serif text-xl tracking-wide text-ivory-100 capitalize">
              {navItems.find((n) =>
                n.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(n.href)
              )?.name || "Control Center"}
            </h1>
            <span className="text-xs text-ivory-400 font-sans">
              | Ayutrika Herbals Botanical Platform
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 text-xs text-gold-300 hover:text-gold-200 bg-forest-900/80 border border-gold-500/40 rounded-luxury hover:bg-forest-850 transition-all flex items-center space-x-2"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Store</span>
            </Link>

            <div className="flex items-center space-x-2 pl-3 border-l border-forest-800">
              <div className="w-8 h-8 rounded-full bg-forest-900 border border-gold-500/60 flex items-center justify-center text-xs font-serif text-gold-400">
                AH
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-xs font-medium text-ivory-100">Apothecary Admin</p>
                <p className="text-[10px] text-ivory-400 font-mono">admin@ayutrika.com</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Children Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
