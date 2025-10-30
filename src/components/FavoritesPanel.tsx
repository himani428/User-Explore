import React from "react";
import type { User } from "../types";
import { useAppStore } from "../store";

export default function FavoritesPanel({ users, onOpen } : { users: User[]; onOpen: (u:User)=>void }) {
  const favs = useAppStore(s => s.favorites);
  const favUsers = users.filter(u => favs.includes(u.id));
  if (favUsers.length === 0) return null;

  return (
    <div className="fav-panel glass">
      <div className="text-sm font-semibold mb-2">Favorites</div>
      <div className="flex flex-col gap-2">
        {favUsers.map(u => (
          <button key={u.id} onClick={() => onOpen(u)} className="text-left px-2 py-1 rounded hover:bg-gray-50">
            <div className="text-sm font-medium">{u.name}</div>
            <div className="muted text-xs">{u.email}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
