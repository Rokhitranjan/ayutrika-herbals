"use client";

import React, { useState } from "react";
import { Customer } from "@/lib/types";
import { formatPrice, formatDate } from "@/lib/utils";
import { Search, Mail, Phone, Calendar, UserCheck, Shield, ShoppingBag } from "lucide-react";

interface CustomersClientProps {
  initialCustomers: Customer[];
}

export default function CustomersClient({ initialCustomers }: CustomersClientProps) {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(q));

    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalSpent = customers.reduce((s, c) => s + c.totalSpending, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-forest-850">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold-400 font-sans font-semibold">
            PATRON DIRECTORY
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-ivory-100 uppercase">
            Ayurvedic Wellness Patrons ({customers.length})
          </h1>
          <p className="text-xs text-ivory-400 font-sans mt-0.5">
            Registered customer accounts, purchasing histories, and wellness journey status.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-3.5 py-1.5 bg-forest-900 border border-gold-500/40 rounded-luxury text-xs">
            <span className="text-[10px] uppercase text-ivory-400 block font-mono">
              Patron Lifetime Value
            </span>
            <span className="font-serif text-gold-400 font-medium text-sm">
              {formatPrice(totalSpent)}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-forest-950 border border-forest-850 p-4 rounded-luxury flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gold-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patrons by name, email, or telephone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs pl-9 pr-3 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-forest-900 border border-forest-800 text-ivory-200 text-xs px-3.5 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans w-full sm:w-auto"
        >
          <option value="all">All Statuses</option>
          <option value="Active">Active Patrons</option>
          <option value="Inactive">Dormant</option>
        </select>
      </div>

      {/* Customers Table */}
      <div className="bg-forest-950 border border-forest-850 rounded-luxury overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="bg-forest-900/60 border-b border-forest-850 text-ivory-400 text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Patron Name</th>
                <th className="py-3 px-4 font-semibold">Contact Info</th>
                <th className="py-3 px-4 font-semibold">Orders Count</th>
                <th className="py-3 px-4 font-semibold">Total Invested</th>
                <th className="py-3 px-4 font-semibold">Member Since</th>
                <th className="py-3 px-4 font-semibold">Last Purchase</th>
                <th className="py-3 px-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-850/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-ivory-400">
                    No registered patrons found matching query.
                  </td>
                </tr>
              ) : (
                filtered.map((customer) => (
                  <tr key={customer.id} className="hover:bg-forest-900/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-forest-900 border border-gold-500/40 flex items-center justify-center font-serif text-gold-400 text-xs font-medium">
                          {customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <div>
                          <p className="font-medium text-ivory-100 font-serif text-sm">
                            {customer.name}
                          </p>
                          <span className="text-[10px] text-ivory-500 font-mono">
                            ID: {customer.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="flex items-center space-x-1.5 text-ivory-300">
                        <Mail className="w-3 h-3 text-gold-400/80" />
                        <span>{customer.email}</span>
                      </div>
                      {customer.phone && (
                        <div className="flex items-center space-x-1.5 text-ivory-400 text-[11px] font-mono">
                          <Phone className="w-3 h-3 text-gold-400/80" />
                          <span>{customer.phone}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-ivory-200">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-forest-900 rounded border border-forest-800">
                        <ShoppingBag className="w-3 h-3 text-gold-400" />
                        <span>{customer.ordersCount}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-serif text-sm text-gold-400 font-medium">
                      {formatPrice(customer.totalSpending)}
                    </td>

                    <td className="py-3.5 px-4 text-ivory-400 font-mono text-[11px]">
                      {formatDate(customer.registrationDate)}
                    </td>

                    <td className="py-3.5 px-4 text-ivory-400 font-mono text-[11px]">
                      {customer.lastOrderDate ? formatDate(customer.lastOrderDate) : "—"}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-[10px] font-mono uppercase ${
                          customer.status === "Active"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                            : "bg-forest-900 text-ivory-500 border border-forest-800"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            customer.status === "Active" ? "bg-emerald-400" : "bg-ivory-600"
                          }`}
                        />
                        <span>{customer.status}</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
