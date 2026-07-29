"use client";

interface FilterPillsProps {
  statuses: string[];
  activeFilter: string;
  onFilterChange: (status: string) => void;
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
    <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
      {statuses.map((status) => {
        const active = activeFilter === status;
        return (
          <button
            key={status}
            onClick={() => onFilterChange(status)}
            className="px-5 py-2.5 rounded-2xl text-sm font-extrabold transition-all duration-200 min-h-[42px] capitalize shadow-sm hover:scale-105"
            style={{
              background: active ? T.success : T.cardBg,
              color: active ? "white" : T.textMid,
              border: `1.5px solid ${active ? T.success : T.border}`,
            }}
          >
            {status.toLowerCase()}
          </button>
        );
      })}
    </div>
  );
}
