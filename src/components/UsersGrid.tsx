// If you already have UsersGrid with different structure, you can keep it.
// This file is optional because App renders the grid above inline.
// But in case you want to use it, here is a minimal version.

import React from "react";
import type { User } from "../types";
import UserCard from "./UserCard";

export default function UsersGrid({ users, onOpen } : { users: User[]; onOpen: (u: User)=>void }) {
  return (
    <div className="users-grid">
      {users.map(u => (
        <div key={u.id} className="card-wrap">
          <UserCard user={u} onOpen={onOpen} />
        </div>
      ))}
    </div>
  );
}
