// ─── Fresh Direct — Farmer Dashboard Constants ────────────────────────────────
// Theme tokens, static data, and status configuration for the Farmer Dashboard.
// Import from "@/constants/dashboardData" in any component.

import {
  LayoutDashboard,
  FileText,
  Zap,
  BarChart3,
  CheckCircle2,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import type {
  Farmer,
  Order,
  StockItem,
  EarningMonth,
  StatusConfig,
  CropStatus,
} from "@/types/dashboard";

// ─── Theme Tokens ─────────────────────────────────────────────────────────────

export const T = {
  primary:   "#1A3020",
  success:   "#3E7B27",
  gold:      "#F2B441",
  bg:        "#F0F7F0",
  cardBg:    "#FFFFFF",
  border:    "#C8DFC8",
  textDark:  "#1A3020",
  textMid:   "#3D5C42",
  textLight: "#6B8F6E",
} as const;

// ─── Farmer Profile ───────────────────────────────────────────────────────────

export const FARMER: Farmer = {
  name:     "Nimal Perera",
  farm:     "Green Hills Farm",
  location: "Nuwara Eliya",
  initials: "NP",
  rating:   4.9,
};

// ─── Navigation Items ─────────────────────────────────────────────────────────

export const NAV_ITEMS = [
  {
    id:          "dashboard" as const,
    name:        "Overview",
    icon:        LayoutDashboard,
    description: "Farm at a glance",
  },
  {
    id:          "orders" as const,
    name:        "Active Orders",
    icon:        FileText,
    description: "Track deliveries",
  },
  {
    id:          "inventory" as const,
    name:        "Manage Stock",
    icon:        Zap,
    description: "Update inventory",
  },
  {
    id:          "payments" as const,
    name:        "My Earnings",
    icon:        BarChart3,
    description: "Revenue & payouts",
  },
];

// ─── Orders Data ──────────────────────────────────────────────────────────────

export const ORDERS: Order[] = [
  { id: "ORD-3012", crop: "Baby Spinach", weight: "18 kg",  buyer: "Anjali Fernando",    date: "2026-04-19", amount: 1980, status: "Ready"      },
  { id: "ORD-3011", crop: "Leeks",        weight: "25 kg",  buyer: "Kasun Jayawardena",  date: "2026-04-19", amount: 1375, status: "Processing"  },
  { id: "ORD-3010", crop: "Murunga",      weight: "10 kg",  buyer: "Priya Kumari",       date: "2026-04-18", amount: 850,  status: "Harvesting"  },
  { id: "ORD-3009", crop: "King Coconut", weight: "40 pcs", buyer: "Dilshan Rathnayake", date: "2026-04-18", amount: 2000, status: "Ready"       },
  { id: "ORD-3008", crop: "Ginger",       weight: "8 kg",   buyer: "Shalini Mendis",     date: "2026-04-17", amount: 1120, status: "Processing"  },
  { id: "ORD-3007", crop: "Bitter Gourd", weight: "15 kg",  buyer: "Roshan Silva",       date: "2026-04-17", amount: 750,  status: "Cancelled"   },
];

// ─── Inventory / Stock Data ───────────────────────────────────────────────────

export const STOCK: StockItem[] = [
  { id: "1", crop: "Baby Spinach", stock: 3,  unit: "kg",    price: 110, status: "Low Stock"    },
  { id: "2", crop: "Leeks",        stock: 42, unit: "kg",    price: 55,  status: "In Stock"     },
  { id: "3", crop: "Murunga",      stock: 1,  unit: "bunch", price: 85,  status: "Low Stock"    },
  { id: "4", crop: "King Coconut", stock: 0,  unit: "pcs",   price: 50,  status: "Out of Stock" },
  { id: "5", crop: "Ginger",       stock: 28, unit: "kg",    price: 140, status: "In Stock"     },
  { id: "6", crop: "Bitter Gourd", stock: 19, unit: "kg",    price: 50,  status: "In Stock"     },
];

// ─── Crop Type Options ────────────────────────────────────────────────────────

export const CROP_TYPES: string[] = [
  "Baby Spinach",
  "Leeks",
  "Murunga / Drumstick",
  "King Coconut",
  "Ginger",
  "Bitter Gourd",
  "Carrot",
  "Tomato",
  "Green Chilli",
  "Gotukola",
  "Pumpkin",
  "Beans",
  "Capsicum",
  "Broccoli",
];

// ─── Monthly Earnings Data ────────────────────────────────────────────────────

export const EARNINGS: EarningMonth[] = [
  { month: "Nov", amount: 52400 },
  { month: "Dec", amount: 68900 },
  { month: "Jan", amount: 61200 },
  { month: "Feb", amount: 74800 },
  { month: "Mar", amount: 83500 },
  { month: "Apr", amount: 47200 },
];

// ─── Order Status Badge Configuration ────────────────────────────────────────

export const STATUS_CFG: Record<CropStatus, StatusConfig> = {
  Ready:      { bg: "bg-[#E6F4E6]", text: "text-[#2A6B1E]", dot: "bg-[#3E7B27]", icon: CheckCircle2 },
  Processing: { bg: "bg-[#FEF3CD]", text: "text-[#7D5A00]", dot: "bg-[#F2B441]", icon: Loader2      },
  Harvesting: { bg: "bg-[#E8F0FF]", text: "text-[#2C4DA0]", dot: "bg-[#4A6FDB]", icon: RefreshCw    },
  Cancelled:  { bg: "bg-[#FEE8E8]", text: "text-[#8B1C1C]", dot: "bg-[#D94040]", icon: AlertCircle  },
};
