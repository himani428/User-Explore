import React from "react";

export default function SearchBar({ value, onChange } : { value: string; onChange: (v:string)=>void }) {
  return (
    <input
      value={value}
      onChange={(e)=>onChange(e.target.value)}
      placeholder="Search by name or email..."
      className="w-full sm:w-2/3 border border-gray-200 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-200"
    />
  );
}
