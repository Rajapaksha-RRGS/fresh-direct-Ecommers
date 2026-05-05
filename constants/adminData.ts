// ─── Admin Dashboard Constants — Fresh Direct ──────────────────────────────────
import {
  LayoutDashboard,
  UserCheck,
  TrendingUp,
  ShoppingBag,
  Users,
} from "lucide-react";

import type { AdminPage, PendingFarmer, PricingRow } from "@/types/admin";

// ─── Theme tokens (re-exported from main T for convenience) ───────────────────
export const AT = {
  primary:   "#1A3020",   // Midnight Forest  — sidebar / headings
  success:   "#3E7B27",   // Fresh Leaf       — primary CTA
  gold:      "#F2B441",   // Harvest Gold     — alerts / pending
  danger:    "#D94040",   // Alert Red        — reject / error
  bg:        "#F0F7F0",   // Mint White       — page background
  cardBg:    "#FFFFFF",
  border:    "#C8DFC8",
  textDark:  "#1A3020",
  textMid:   "#3D5C42",
  textLight: "#6B8F6E",
} as const;

// ─── Admin Navigation ─────────────────────────────────────────────────────────
export const ADMIN_NAV: {
  id: AdminPage;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}[] = [
  { id: "dashboard", name: "Dashboard",        icon: LayoutDashboard, description: "Platform overview"      },
  { id: "approvals", name: "Farmer Approvals", icon: UserCheck,       description: "Verify new farmers"     },
  { id: "pricing",   name: "Market Pricing",   icon: TrendingUp,      description: "Dynamic price engine"   },
  { id: "orders",    name: "Active Orders",    icon: ShoppingBag,     description: "Monitor all orders"     },
  { id: "users",     name: "User Management",  icon: Users,           description: "Manage accounts"        },
];

// ─── Pending Farmer Approvals (mock — replace with DB fetch) ──────────────────
export const PENDING_FARMERS: PendingFarmer[] = [
  {
    id:          "fp001",
    name:        "Sunil Rajapaksha",
    nic:         "901234567V",
    location:    "Nuwara Eliya, Central Province",
    farmName:    "Hill Top Greens",
    mobile:      "0771234567",
    submittedAt: "2026-04-19",
    cropTypes:   ["Carrot", "Leeks", "Broccoli"],
  },
  {
    id:          "fp002",
    name:        "Chamari Dissanayake",
    nic:         "199512345678",
    location:    "Matale, Central Province",
    farmName:    "Sunrise Organic Farm",
    mobile:      "0769876543",
    submittedAt: "2026-04-18",
    cropTypes:   ["Tomato", "Green Chilli", "Capsicum"],
  },
  {
    id:          "fp003",
    name:        "Kamal Fernando",
    nic:         "851119876V",
    location:    "Ratnapura, Sabaragamuwa",
    farmName:    "Golden Harvest",
    mobile:      "0712345678",
    submittedAt: "2026-04-17",
    cropTypes:   ["Ginger", "Sweet Potato", "King Coconut"],
  },
  {
    id:          "fp004",
    name:        "Priyantha Weerasinghe",
    nic:         "197834521V",
    location:    "Kurunegala, North Western",
    farmName:    "Green Valley Farm",
    mobile:      "0703456789",
    submittedAt: "2026-04-16",
    cropTypes:   ["Baby Spinach", "Gotukola", "Beans"],
  },
];

// ─── Pricing Engine Data (mock — derive from live Product + Order aggregation) ─
export const PRICING_DATA: PricingRow[] = [
  { id: "p1", name: "Baby Spinach",   category: "vegetables", basePrice: 110, unit: "kg",    supply: 42,  supplyMax: 300, supplyPct: 14,  demand: "High",   dynamicPrice: 143 },
  { id: "p2", name: "Carrot",         category: "vegetables", basePrice: 80,  unit: "kg",    supply: 120, supplyMax: 300, supplyPct: 40,  demand: "Low",    dynamicPrice: 68  },
  { id: "p3", name: "King Coconut",   category: "fruits",     basePrice: 50,  unit: "pcs",   supply: 300, supplyMax: 300, supplyPct: 100, demand: "High",   dynamicPrice: 65  },
  { id: "p4", name: "Green Chilli",   category: "vegetables", basePrice: 250, unit: "kg",    supply: 18,  supplyMax: 300, supplyPct: 6,   demand: "High",   dynamicPrice: 325 },
  { id: "p5", name: "Ginger",         category: "herbs",      basePrice: 140, unit: "kg",    supply: 85,  supplyMax: 300, supplyPct: 28,  demand: "Medium", dynamicPrice: 140 },
  { id: "p6", name: "Gotukola",       category: "herbs",      basePrice: 60,  unit: "bunch", supply: 200, supplyMax: 300, supplyPct: 67,  demand: "Low",    dynamicPrice: 48  },
  { id: "p7", name: "Tomato",         category: "vegetables", basePrice: 120, unit: "kg",    supply: 65,  supplyMax: 300, supplyPct: 22,  demand: "Medium", dynamicPrice: 120 },
  { id: "p8", name: "Bitter Gourd",   category: "vegetables", basePrice: 50,  unit: "kg",    supply: 35,  supplyMax: 300, supplyPct: 12,  demand: "Medium", dynamicPrice: 55  },
];
