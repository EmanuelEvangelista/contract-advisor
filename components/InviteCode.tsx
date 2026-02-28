"use client";
import { useEffect, useState } from "react";
import { IStudio } from "@/models/Studio";

const InviteCode = () => {
  const [studioCode, setStudioCode] = useState<IStudio | null>(null);

  useEffect(() => {
    const fetchStudio = async () => {
      const res = await fetch("/api/studio");

      if (!res.ok) {
        console.error("Error:", res.status);
        return;
      }

      const data = await res.json();
      setStudioCode(data);
    };

    fetchStudio();
  }, []);

  if (!studioCode) return null;

  return (
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
      <div className="flex flex-col">
        <span className="text-[10px] uppercase font-bold text-slate-400 leading-none ml-1">
          Invite Code
        </span>
        <span className="text-sm font-mono font-bold text-indigo-900 tracking-wider px-1">
          {studioCode.invitationCode}
        </span>
      </div>
    </div>
  );
};

export default InviteCode;
