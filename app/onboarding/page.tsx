"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaBuilding, FaUserPlus, FaArrowRight } from "react-icons/fa";

const OnboardingPage = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [view, setView] = useState<"choice" | "create" | "join">("choice");
  const [studioName, setStudioName] = useState("");
  const [invitationCode, setInvitationCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push("/");
    } else if (session?.user?.studioId) {
      router.replace("/panel");
    }
  }, [session, router]);

  if (status === "loading") return null;

  const handleSubmit = async (action: "create" | "join") => {
    setLoading(true);

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          studioName: action === "create" ? studioName : undefined,
          invitationCode: action === "join" ? invitationCode : undefined,
        }),
      });

      if (res.ok) {
        await update();
        router.push("/panel");
        router.refresh();
      } else {
        const err = await res.json();
        alert(err.error || "Error en el proceso");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Card Principal */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-indigo-500/10 p-10 border border-slate-100">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-slate-900 mb-3">
              Final Step!
            </h1>
            <p className="text-slate-500 leading-relaxed">
              Hello{" "}
              <span className="font-bold text-indigo-600">
                {session?.user?.name}
              </span>
              , how will you use the platform?
            </p>
          </div>

          {view === "choice" && (
            <div className="grid gap-4">
              <button
                onClick={() => setView("create")}
                className="group flex items-center gap-4 p-5 rounded-2xl border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all text-left"
              >
                <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <FaBuilding size={24} />
                </div>
                <div>
                  <p className="font-bold text-slate-800">I am an Accountant</p>
                  <p className="text-xs text-slate-500">
                    Create a new studio and invite my team.
                  </p>
                </div>
              </button>

              <button
                onClick={() => setView("join")}
                className="group flex items-center gap-4 p-5 rounded-2xl border-2 border-slate-100 hover:border-pink-500 hover:bg-pink-50/50 transition-all text-left"
              >
                <div className="bg-pink-100 p-3 rounded-xl text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                  <FaUserPlus size={24} />
                </div>
                <div>
                  <p className="font-bold text-slate-800">I am an Employee</p>
                  <p className="text-xs text-slate-500">
                    Join an existing studio with a code.
                  </p>
                </div>
              </button>
            </div>
          )}

          {view === "create" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <label className="block text-sm font-bold text-slate-700 ml-1">
                Studio Name
              </label>
              <input
                autoFocus
                type="text"
                placeholder="Ex: Perez & Associates"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
              />
              <button
                disabled={loading || studioName.length < 3}
                onClick={() => handleSubmit("create")}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-all"
              >
                {loading ? "Creating..." : "Create Studio"} <FaArrowRight />
              </button>
              <button
                onClick={() => setView("choice")}
                className="w-full text-slate-400 text-sm hover:underline"
              >
                Go back
              </button>
            </div>
          )}

          {view === "join" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <label className="block text-sm font-bold text-slate-700 ml-1">
                Invitation Code
              </label>
              <input
                autoFocus
                type="text"
                placeholder="123A45F5"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 transition-all text-slate-800 uppercase"
                value={invitationCode}
                onChange={(e) => setInvitationCode(e.target.value)}
              />
              <button
                disabled={loading || invitationCode.length < 5}
                onClick={() => handleSubmit("join")}
                className="w-full py-4 bg-pink-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-pink-700 disabled:opacity-50 transition-all"
              >
                {loading ? "Joining..." : "Join Studio"} <FaArrowRight />
              </button>
              <button
                onClick={() => setView("choice")}
                className="w-full text-slate-400 text-sm hover:underline"
              >
                Go back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
