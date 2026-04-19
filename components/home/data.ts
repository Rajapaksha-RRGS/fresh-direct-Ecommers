// ─── Static Demo Data (replace with MongoDB fetch in Phase 3) ─────────────────
import { ProductCardProps } from "@/components/product/ProductCard";
import { FarmerCardProps } from "@/components/farmer/FarmerCard";

// ─── Shared Constants ─────────────────────────────────────────────────────────
export const DECORATIVE_LEAVES = ["🍃", "🌿", "🍂", "🌱"] as const;

export const TRUST_SIGNALS = [
  "✅ No Middlemen",
  "🌿 Chemical-Free",
  "⚡ 24h Delivery",
] as const;

// ─── Product Data ─────────────────────────────────────────────────────────────
export const FEATURED_PRODUCTS: ProductCardProps[] = [
  {
    id: "p1",
    name: "Baby Spinach",
    category: "Vegetables",
    basePrice: 220,
    currentPrice: 264,
    demandFactor: 1.35,
    unit: "500g",
    image:
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop",
    harvestDate: new Date(Date.now() - 4 * 3600000).toISOString(),
    farmerId: "f1",
    farmerName: "Nimal Perera",
    farmLocation: "Nuwara Eliya",
    stockQty: 28,
    isOrganic: true,
  },
  {
    id: "p2",
    name: "King Coconut",
    category: "Fruits",
    basePrice: 120,
    currentPrice: 96,
    demandFactor: 0.8,
    unit: "piece",
    image:
      "https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=400&h=300&fit=crop",
    harvestDate: new Date(Date.now() - 8 * 3600000).toISOString(),
    farmerId: "f2",
    farmerName: "Sudu Banda",
    farmLocation: "Kurunegala",
    stockQty: 4,
    isOrganic: false,
  },
  {
    id: "p3",
    name: "Cherry Tomatoes",
    category: "Vegetables",
    basePrice: 380,
    currentPrice: 399,
    demandFactor: 1.05,
    unit: "kg",
    image:
      "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&h=300&fit=crop",
    harvestDate: new Date(Date.now() - 6 * 3600000).toISOString(),
    farmerId: "f3",
    farmerName: "Kamala Devi",
    farmLocation: "Jaffna",
    stockQty: 15,
    isOrganic: true,
  },
  {
    id: "p4",
    name: "Red Lotus Rice",
    category: "Grains",
    basePrice: 560,
    currentPrice: 560,
    demandFactor: 1.0,
    unit: "kg",
    image:
      "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&h=300&fit=crop",
    harvestDate: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
    farmerId: "f4",
    farmerName: "Ravi Kumaran",
    farmLocation: "Polonnaruwa",
    stockQty: 50,
    isOrganic: false,
  },
  {
    id: "p5",
    name: "Murunga Leaves",
    category: "Herbs",
    basePrice: 80,
    currentPrice: 104,
    demandFactor: 1.4,
    unit: "bunch",
    image:
      "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400&h=300&fit=crop",
    harvestDate: new Date(Date.now() - 2 * 3600000).toISOString(),
    farmerId: "f1",
    farmerName: "Nimal Perera",
    farmLocation: "Nuwara Eliya",
    stockQty: 8,
    isOrganic: true,
  },
  {
    id: "p6",
    name: "Pineapple",
    category: "Fruits",
    basePrice: 350,
    currentPrice: 315,
    demandFactor: 0.9,
    unit: "piece",
    image:
      "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=300&fit=crop",
    harvestDate: new Date(Date.now() - 12 * 3600000).toISOString(),
    farmerId: "f5",
    farmerName: "Saman Wickrama",
    farmLocation: "Gampaha",
    stockQty: 22,
    isOrganic: false,
  },
];

// ─── Farmer Data ──────────────────────────────────────────────────────────────
export const FEATURED_FARMER: FarmerCardProps = {
  id: "f1",
  farmerName: "Nimal Perera",
  farmName: "Green Hills Farm",
  location: "Nuwara Eliya, Central Province",
  bio: "Third-generation farmer specializing in highland vegetables. Our farm sits at 1,800m elevation, producing some of the finest organic greens in Sri Lanka. We believe in sustainable farming that respects both nature and the consumer.",
  image:
    "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=200&h=200&fit=crop",
  productCount: 14,
  certifications: ["Organic Certified", "SL GAP", "Chemical-Free"],
  isVerified: true,
  rating: 4.9,
  reviewCount: 234,
};

// ─── Reviews Data ─────────────────────────────────────────────────────────────
export interface Review {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  text: string;
  product: string;
}

export const REVIEWS: Review[] = [
  {
    id: "r1",
    name: "Sachini Fernando",
    location: "Colombo 7",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=60&h=60&fit=crop&face",
    rating: 5,
    text: "Absolutely incredible quality! The spinach was so fresh it still had dew on it. Delivered within 12 hours of ordering. My family couldn't believe it!",
    product: "Baby Spinach from Nimal Perera",
  },
  {
    id: "r2",
    name: "Dinesh Jayawardena",
    location: "Kandy",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&face",
    rating: 5,
    text: "Finally, a platform that connects us to the real source! The tomatoes were perfect and the price was much better than the supermarket.",
    product: "Cherry Tomatoes from Kamala Devi",
  },
  {
    id: "r3",
    name: "Priya Ratnayake",
    location: "Nugegoda",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&face",
    rating: 5,
    text: "I love that I can see exactly which farmer grew my food. The king coconuts from Sudu Banda were the sweetest I've ever had!",
    product: "King Coconut from Sudu Banda",
  },
];

// ─── Stats Data ───────────────────────────────────────────────────────────────
export interface Stat {
  value: string;
  label: string;
  icon: string;
}

export const STATS: Stat[] = [
  { value: "500+", label: "Verified Farmers", icon: "👨‍🌾" },
  { value: "10K+", label: "Happy Families", icon: "🏠" },
  { value: "24h", label: "Max Delivery Time", icon: "⚡" },
  { value: "98%", label: "Freshness Rating", icon: "🌿" },
];

// ─── How It Works Steps ───────────────────────────────────────────────────────
export interface Step {
  num: string;
  icon: string;
  title: string;
  desc: string;
}

export const STEPS: Step[] = [
  {
    num: "01",
    icon: "🔍",
    title: "Browse & Choose",
    desc: "Search thousands of fresh produce listings from verified Sri Lankan farmers. Filter by category, location, or harvest date.",
  },
  {
    num: "02",
    icon: "🌾",
    title: "Farmer Harvests",
    desc: "Your order triggers a real-time harvest notification to the farmer. Produce is picked fresh, same day — no cold storage delays.",
  },
  {
    num: "03",
    icon: "🚚",
    title: "Delivered Fresh",
    desc: "Farm-direct to your door within 24 hours. Track your order in real-time via WhatsApp or SMS updates.",
  },
];

// ─── Footer Data ──────────────────────────────────────────────────────────────
export interface FooterColumn {
  heading: string;
  links: { label: string; href: string }[];
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Marketplace",
    links: [
      { label: "All Products", href: "/products" },
      { label: "Vegetables", href: "/products?category=vegetables" },
      { label: "Fruits", href: "/products?category=fruits" },
      { label: "Herbs", href: "/products?category=herbs" },
      { label: "Grains", href: "/products?category=grains" },
    ],
  },
  {
    heading: "Farmers",
    links: [
      { label: "Join as Farmer", href: "/register?role=farmer" },
      { label: "Farmer Dashboard", href: "/FamerDashbord" },
      { label: "Success Stories", href: "#" },
      { label: "Certification", href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

export const LEGAL_LINKS = ["Privacy Policy", "Terms of Service", "Cookie Policy"];

export const SOCIAL_LINKS = [
  { label: "Facebook", icon: "f" },
  { label: "Twitter", icon: "𝕏" },
  { label: "Instagram", icon: "📷" },
  { label: "WhatsApp", icon: "💬" },
];
