import React from "react";

export default function FilterDropdown({ cities, selected, onChange } : { cities: string[]; selected: string; onChange:(v:string)=>void }) {
  return (
    <select
      value={selected}
      onChange={(e)=>onChange(e.target.value)}
      className="w-full sm:w-1/3 border border-gray-200 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-200"
    >
      <option value="">All Cities</option>
      {cities.map(c => <option key={c} value={c}>{c}</option>)}
    </select>
  );
}
