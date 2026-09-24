"use client";

import React from "react";
import { usePathname } from "next/navigation";
import AnnouncementBar from "./AnnouncementBar";
import Header from "./Header";
import Footer from "./Footer";
import MobileNav from "./MobileNav";
import LuxuryCursor from "../ui/LuxuryCursor";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      <LuxuryCursor />
      {!isAdmin && <AnnouncementBar />}
      {!isAdmin && <Header />}
      <main className="min-h-screen">{children}</main>
      {!isAdmin && <Footer />}
      {!isAdmin && <MobileNav />}
    </>
  );
}
