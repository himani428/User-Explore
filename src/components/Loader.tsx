import React from "react";

export default function Loader(){
  return (
    <div className="w-full flex flex-col items-center justify-center py-20">
      <div className="w-14 h-14 rounded-full border-4 border-t-primary border-slate-200 animate-spin"></div>
      <p className="mt-4 text-slate-500">Loading users...</p>
    </div>
  );
}
