import React from "react";

export default function ErrorView({ message = "Something went wrong." }: { message?: string }){
  return (
    <div className="w-full p-8 flex flex-col items-center">
      <div className="text-red-500 text-4xl">⚠️</div>
      <p className="mt-4 text-center text-slate-600">{message}</p>
    </div>
  );
}
