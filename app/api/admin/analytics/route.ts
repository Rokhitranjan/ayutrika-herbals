import { NextResponse } from "next/server";
import { getAnalytics, getCustomers } from "@/lib/data/store";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const analytics = await getAnalytics();
    const customers = await getCustomers();

    // Chart mock progression based on real store total
    const months = ["Oct 25", "Nov 25", "Dec 25", "Jan 26", "Feb 26", "Mar 26"];
    const baseRevenue = Math.round(analytics.totalSales / 3) || 85000;
    const revenueChart = months.map((m, i) => ({
      month: m,
      revenue: Math.round(baseRevenue * (0.6 + i * 0.15)),
      orders: Math.round(20 + i * 8),
    }));

    return NextResponse.json({
      ...analytics,
      customers,
      revenueChart,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
