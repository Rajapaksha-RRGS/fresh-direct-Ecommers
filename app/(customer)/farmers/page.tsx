import React from "react";
import FarmerCard from "@/components/farmer/FarmerCard";

const FARMERS = [
  {
    id: "f1", farmerName: "Nimal Perera", farmName: "Green Hills Farm",
    location: "Nuwara Eliya", bio: "Third-generation farmer specializing in highland vegetables and herbs. We practice regenerative agriculture to restore soil health.",
    image: "https://images.unsplash.com/photo-1592748379328-afd77dc70038?w=200&h=200&fit=crop&crop=face",
    productCount: 12, certifications: ["Organic", "SL-GAP"], isVerified: true, rating: 4.8, reviewCount: 124,
  },
  {
    id: "f2", farmerName: "Sudu Banda", farmName: "Kurunegala Coconut Estate",
    location: "Kurunegala", bio: "Family-owned coconut farm with over 200 acres. We produce premium king coconut, desiccated coconut and coconut oil.",
    image: "https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?w=200&h=200&fit=crop&crop=face",
    productCount: 6, certifications: ["Export Quality"], isVerified: true, rating: 4.6, reviewCount: 87,
  },
  {
    id: "f3", farmerName: "Kamala Devi", farmName: "Jaffna Organic Gardens",
    location: "Jaffna", bio: "We grow Northern Province vegetables using traditional Jaffna farming methods passed down through generations.",
    image: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=200&h=200&fit=crop&crop=face",
    productCount: 18, certifications: ["Organic", "Women Farmer"], isVerified: true, rating: 4.9, reviewCount: 203,
  },
  {
    id: "f4", farmerName: "Ravi Kumaran", farmName: "Polonnaruwa Paddy Fields",
    location: "Polonnaruwa", bio: "Traditional paddy farmer growing heritage rice varieties including Red Lotus, Suwadel and Samba.",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&h=200&fit=crop&crop=face",
    productCount: 8, certifications: ["Heritage Grains"], isVerified: false, rating: 4.5, reviewCount: 56,
  },
  {
    id: "f5", farmerName: "Saman Wickrama", farmName: "Gampaha Tropical Farm",
    location: "Gampaha", bio: "Tropical fruit specialist growing pineapple, mango, rambutan, and exotic fruits in the wet zone.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    productCount: 14, certifications: ["Tropical Fruits"], isVerified: true, rating: 4.7, reviewCount: 98,
  },
  {
    id: "f6", farmerName: "Priya Rajapaksa", farmName: "Kandy Spice Garden",
    location: "Kandy", bio: "Spice grower in the heart of the Kandy hills. We produce cinnamon, pepper, cardamom and vanilla — all certified organic.",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face",
    productCount: 10, certifications: ["Organic", "Fair Trade"], isVerified: true, rating: 4.9, reviewCount: 167,
  },
];

export default function FarmersPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--color-off-white)", paddingTop: "5rem" }}>
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "3rem 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-forest)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
            Our Farmers
          </span>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 800, color: "var(--color-text-dark)", marginTop: "0.4rem" }}>
            Meet the People Behind Your Food
          </h1>
          <p style={{ fontSize: "0.95rem", color: "var(--color-text-mid)", marginTop: "0.5rem", maxWidth: "520px", margin: "0.5rem auto 0" }}>
            500+ verified farmers across Sri Lanka, growing with passion and care.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {FARMERS.map((farmer) => (
            <FarmerCard key={farmer.id} {...farmer} />
          ))}
        </div>
      </section>
    </main>
  );
}
