import React from "react";

export default function Header(){
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <div>
        <h1 className="text-2xl font-extrabold">User Explorer</h1>
        <p className="text-sm muted mt-1">Search, filter, and favorite users — beautifully.</p>
      </div>
      <div className="hidden sm:flex items-center gap-3">
        <div className="text-sm muted">React • Tailwind • TypeScript</div>
      </div>
    </div>
  );
}
