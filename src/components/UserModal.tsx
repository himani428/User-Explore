import React from "react";
import type { User } from "../types";

export default function UserModal({ user, onClose } : { user: User | null; onClose: ()=>void }) {
  if (!user) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4">
      <div className="max-w-2xl w-full glass rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-400 text-white flex items-center justify-center text-xl font-bold">
              {user.name.split(" ").map(n => n[0]).slice(0,2).join("")}
            </div>
            <div>
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <p className="muted text-sm mt-1">{user.username} • {user.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-600">✕</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 rounded bg-white/60">
            <h4 className="text-sm font-medium">Contact</h4>
            <p className="muted mt-2">Phone: {user.phone}</p>
            <p className="muted">Website: {user.website}</p>
          </div>
          <div className="p-4 rounded bg-white/60">
            <h4 className="text-sm font-medium">Company</h4>
            <p className="muted mt-2">{user.company?.name}</p>
            <p className="muted text-xs mt-1">{user.company?.catchPhrase}</p>
          </div>
          <div className="md:col-span-2 p-4 rounded bg-white/60">
            <h4 className="text-sm font-medium">Address</h4>
            <p className="muted mt-2">{user.address.street}, {user.address.suite}, {user.address.city} - {user.address.zipcode}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-md border border-gray-200">Close</button>
        </div>
      </div>
    </div>
  );
}
