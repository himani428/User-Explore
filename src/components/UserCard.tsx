import React from "react";
import type { User } from "../types";
import { useAppStore } from "../store";

export default function UserCard({ user, onOpen } : { user: User; onOpen: (u:User)=>void }) {
  const toggleFav = useAppStore(s => s.toggleFavorite);
  const isFav = useAppStore(s => s.isFavorite(user.id));

  return (
    <div className="card">
      <div className="flex items-center gap-4">
        <div className="avatar">{user.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</div>
        <div>
          <div className="text-lg font-semibold">{user.name}</div>
          <div className="muted text-sm mt-1">{user.email}</div>
          <div className="muted text-xs mt-2">{user.address.city} • {user.company?.name}</div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-3">
        <button onClick={() => toggleFav(user.id)} className="fav-btn" title="Toggle favorite">
          {isFav ? "★" : "☆"}
        </button>
        <button onClick={()=>onOpen(user)} className="view-btn">View</button>
      </div>
    </div>
  );
}
