"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";

const CronTestButton = () => {
  const [loading, setLoading] = useState(false);

  const handleCronTest = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contracts/check-expiring");
      const data = await res.json();

      if (res.ok) {
        toast.success(
          `✅ Success: ${data.message || "Emails sent successfully!"}`,
        );
      } else {
        toast.error("❌ Error: Could not process expiry alerts.");
      }
    } catch (error) {
      console.error("Cron Test Error:", error);
      toast.error("❌ Connection error. Check the console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl shadow-sm">
      <h3 className="text-sm font-semibold text-indigo-900 mb-2">
        Developer Tools (Demo)
      </h3>
      <p className="text-xs text-indigo-700 mb-4">
        Click to manually trigger the Resend email alerts for contracts expiring
        soon.
      </p>

      <button
        onClick={handleCronTest}
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all"
      >
        {loading ? (
          <>
            <Spinner loading={loading} />
            Processing...
          </>
        ) : (
          <>Trigger Expiry Alerts</>
        )}
      </button>
    </div>
  );
};

export default CronTestButton;
