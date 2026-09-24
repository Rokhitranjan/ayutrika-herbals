"use client";

import React, { useState } from "react";
import { ShieldCheck, Mail, Key, UserCheck, Plus, Check } from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  lastActive: string;
  status: "Active" | "Inactive";
}

const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: "adm-1",
    name: "Master Apothecary Admin",
    email: "admin@ayutrika.com",
    role: "Super Admin",
    lastActive: "Just now",
    status: "Active",
  },
  {
    id: "adm-2",
    name: "Chief Ayurvedic Vaidya",
    email: "vaidya@ayutrika.com",
    role: "Editorial & Formulations",
    lastActive: "2 hours ago",
    status: "Active",
  },
  {
    id: "adm-3",
    name: "Dispatch & Fulfillment Lead",
    email: "fulfillment@ayutrika.com",
    role: "Inventory & Dispatch",
    lastActive: "Yesterday",
    status: "Active",
  },
];

export default function UsersClient() {
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Sanctuary Staff");

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: AdminUser = {
      id: `adm-${Date.now()}`,
      name,
      email,
      role,
      lastActive: "Never",
      status: "Active",
    };
    setUsers([...users, newUser]);
    setIsModalOpen(false);
    setName("");
    setEmail("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-forest-850">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold-400 font-sans font-semibold">
            ACCESS &amp; PERMISSIONS
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-ivory-100 uppercase">
            Apothecary Staff &amp; Administrators ({users.length})
          </h1>
          <p className="text-xs text-ivory-400 font-sans mt-0.5">
            Manage authenticated administrators, catalog editors, and dispatch staff.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-forest-950 text-xs font-semibold uppercase tracking-wider rounded-luxury transition-all flex items-center space-x-2 shadow-luxury w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Admin User</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-forest-950 border border-forest-850 rounded-luxury overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="bg-forest-900/60 border-b border-forest-850 text-ivory-400 text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">User</th>
                <th className="py-3 px-4 font-semibold">Email</th>
                <th className="py-3 px-4 font-semibold">Access Privilege</th>
                <th className="py-3 px-4 font-semibold">Last Active</th>
                <th className="py-3 px-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-850/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-forest-900/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-forest-900 border border-gold-500/40 flex items-center justify-center font-serif text-gold-400 text-xs">
                        {u.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                      <span className="font-medium text-ivory-100 font-serif text-sm">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-ivory-300">{u.email}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-forest-900 text-gold-300 border border-forest-800 text-[10px] font-mono">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-ivory-400 text-[11px]">{u.lastActive}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{u.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-forest-950 border border-forest-800 w-full max-w-md rounded-luxury p-6 space-y-4">
            <h2 className="font-serif text-lg text-ivory-100 border-b border-forest-850 pb-2">
              Invite Administrator
            </h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-3 py-2 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-3 py-2 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-forest-900 border border-forest-800 text-ivory-100 text-xs px-3 py-2 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Catalog Editor">Catalog Editor</option>
                  <option value="Fulfillment Staff">Fulfillment Staff</option>
                  <option value="Journal Editor">Journal Editor</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-forest-850">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-forest-900 hover:bg-forest-850 text-ivory-300 text-xs rounded-luxury"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gold-500 hover:bg-gold-400 text-forest-950 text-xs font-bold uppercase tracking-wider rounded-luxury"
                >
                  Add Admin User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
