import React from "react";

export default function EmptyState({ text = "No users found." }: { text?: string }){
  return (
    <div className="w-full p-8 flex flex-col items-center">
      <div className="w-24 h-24 rounded-full flex items-center justify-center glass border border-slate-200">
        <svg className="w-10 h-10 text-slate-400" viewBox="0 0 24 24" fill="none">
          <path d="M3 7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7z" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      </div>
      <p className="mt-4 text-slate-500">{text}</p>
    </div>
  );
}
