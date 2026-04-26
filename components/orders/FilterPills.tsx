"use client";

type CropStatus = "Ready" | "Processing" | "Harvesting" | "Cancelled";

interface FilterPillsProps {
  statuses: ("All" | CropStatus)[];
  activeFilter: "All" | CropStatus;
  onFilterChange: (status: "All" | CropStatus) => void;
}

const T = {
  success: "#3E7B27",
  cardBg: "#FFFFFF",
  border: "#C8DFC8",
  textMid: "#3D5C42",
} as const;

export default function FilterPills({
  statuses,
  activeFilter,
  onFilterChange,
}: FilterPillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => {
        const active = activeFilter === status;
        return (
          <button
            key={status}
            onClick={() => onFilterChange(status)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 min-h-[40px]"
            style={{
              background: active ? T.success : T.cardBg,
              color: active ? "white" : T.textMid,
              border: `1.5px solid ${active ? T.success : T.border}`,
            }}
          >
            {status}
          </button>
        );
      })}
    </div>
  );
}
