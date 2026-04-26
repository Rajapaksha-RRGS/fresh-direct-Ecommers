"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, Loader2, Eye } from "lucide-react";
import { AT } from "@/constants/adminData";
import type { PendingFarmer } from "@/types/admin";

const cn = (...c: (string | boolean | undefined | null)[]) => c.filter(Boolean).join(" ");

interface ApprovalTableProps {
  farmers: PendingFarmer[];
  /** Called after a farmer is successfully approved or rejected so the
   *  parent can re-sync analytics stats without a page reload. */
  onActionSuccess?: (action: "approve" | "reject") => void;
}

type ActionState = "idle" | "approving" | "rejecting" | "done";

export default function ApprovalTable({ farmers: initial, onActionSuccess }: ApprovalTableProps) {
  const [farmers, setFarmers] = useState<PendingFarmer[]>(initial);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [actionState, setActionState] = useState<Record<string, ActionState>>({});

  const handleAction = async (id: string, action: "approve" | "reject") => {
    // 1. Loading state එක පටන් ගන්නවා
    setActionState((s) => ({ ...s, [id]: action === "approve" ? "approving" : "rejecting" }));

    try {
      // 2. ඇත්තටම Backend එකට Request එක යවනවා
      // Route: PATCH /api/admin/farmers/[id]  (see app/api/admin/farmers/[id]/route.ts)
      const res = await fetch(`/api/admin/farmers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: action === "approve" ? "APPROVED" : "REJECTED",
        }),
      });

      if (!res.ok) throw new Error("Failed to update");

      // 3. සාර්ථක නම් "done" state එකට දානවා
      setActionState((s) => ({ ...s, [id]: "done" }));

      // 4. Parent dashboard stats refetch trigger (analytics bridge)
      onActionSuccess?.(action);

      // 5. තත්පර භාගයකට පස්සේ ලිස්ට් එකෙන් ඒ ගොවියව අයින් කරනවා
      setTimeout(() => {
        setFarmers((f) => f.filter((x) => x.id !== id));
      }, 600);

    } catch (err) {
      console.error("Update Error:", err);
      alert("මචං වැඩේ වැරදුනා! ආයෙත් උත්සාහ කරන්න.");
      setActionState((s) => ({ ...s, [id]: "idle" })); // ආපහු තිබුණ තත්ත්වයට ගන්නවා
    }
  };

  if (farmers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle2 className="w-14 h-14 mb-4" style={{ color: AT.success }} />
        <p className="font-bold text-[1rem]" style={{ color: AT.textDark }}>
          All clear! No pending verifications.
        </p>
        <p className="text-[0.82rem] mt-1" style={{ color: AT.textLight }}>
          New applications will appear here as farmers register.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {farmers.map((f) => {
        const state = actionState[f.id] ?? "idle";
        const isOpen = expanded === f.id;
        const isDone = state === "done";

        return (
          <div
            key={f.id}
            className={cn(
              "rounded-3xl border overflow-hidden transition-all duration-300",
              isDone ? "opacity-40 scale-[0.99]" : "opacity-100",
            )}
            style={{ borderColor: AT.border, background: AT.cardBg }}
          >
            {/* ── Summary row ─────────────────────────────────────────────── */}
            <div className="flex items-center gap-4 px-5 py-4">
              {/* Avatar */}
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0 shadow"
                style={{ background: `linear-gradient(135deg, ${AT.primary}, ${AT.success})` }}
              >
                {f.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
              </div>

              {/* Name + farm */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[0.9rem] truncate" style={{ color: AT.textDark }}>
                  {f.name}
                </p>
                <p className="text-[0.75rem] truncate" style={{ color: AT.textLight }}>
                  {f.farmName} · {f.location}
                </p>
              </div>

              {/* NIC — hidden on smallest screens */}
              <span
                className="hidden sm:block text-[0.75rem] font-mono px-2.5 py-1 rounded-xl flex-shrink-0"
                style={{ background: AT.bg, color: AT.textMid }}
              >
                {f.nic}
              </span>

              {/* Submitted */}
              <span
                className="hidden md:block text-[0.72rem] flex-shrink-0"
                style={{ color: AT.textLight }}
              >
                {f.submittedAt}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Expand details */}
                <button
                  onClick={() => setExpanded(isOpen ? null : f.id)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                  style={{ background: AT.bg }}
                  aria-label="View details"
                >
                  {isOpen
                    ? <ChevronUp className="w-4 h-4" style={{ color: AT.textMid }} />
                    : <ChevronDown className="w-4 h-4" style={{ color: AT.textMid }} />}
                </button>

                {/* Approve */}
                <button
                  onClick={() => handleAction(f.id, "approve")}
                  disabled={state !== "idle"}
                  className={cn(
                    "h-9 px-4 rounded-xl font-bold text-[0.78rem] flex items-center gap-1.5 transition-all duration-200",
                    state === "idle" && "hover:opacity-90 hover:-translate-y-px",
                    state !== "idle" && "opacity-60 cursor-not-allowed",
                  )}
                  style={{ background: AT.success, color: "#fff" }}
                >
                  {state === "approving"
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">Approve</span>
                </button>

                {/* Reject */}
                <button
                  onClick={() => handleAction(f.id, "reject")}
                  disabled={state !== "idle"}
                  className={cn(
                    "h-9 px-4 rounded-xl font-bold text-[0.78rem] flex items-center gap-1.5 transition-all duration-200",
                    state === "idle" && "hover:opacity-90",
                    state !== "idle" && "opacity-60 cursor-not-allowed",
                  )}
                  style={{ background: "#FEE8E8", color: AT.danger }}
                >
                  {state === "rejecting"
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : <XCircle className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">Reject</span>
                </button>
              </div>
            </div>

            {/* ── Expanded details ─────────────────────────────────────────── */}
            {isOpen && (
              <div
                className="px-5 pb-5 pt-1 border-t grid grid-cols-1 sm:grid-cols-3 gap-4 text-[0.82rem]"
                style={{ borderColor: AT.border, background: AT.bg }}
              >
                <div>
                  <p className="font-semibold mb-1" style={{ color: AT.textLight }}>Mobile</p>
                  <p className="font-bold" style={{ color: AT.textDark }}>{f.mobile}</p>
                </div>
                <div>
                  <p className="font-semibold mb-1" style={{ color: AT.textLight }}>NIC</p>
                  <p className="font-bold font-mono" style={{ color: AT.textDark }}>{f.nic}</p>
                </div>
                <div>
                  <p className="font-semibold mb-1" style={{ color: AT.textLight }}>Crop Types</p>
                  <div className="flex flex-wrap gap-1.5">
                    {f.cropTypes.map((c) => (
                      <span
                        key={c}
                        className="px-2 py-0.5 rounded-lg text-[0.7rem] font-semibold"
                        style={{ background: "#E6F4E6", color: "#1A5C1A" }}
                      >
                        🌱 {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
