"use client";

import Link from "next/link";

export interface FarmerCardProps {
  id: string;
  farmerName: string;
  farmName: string;
  location: string;
  bio: string;
  image: string;
  productCount: number;
  certifications: string[];
  isVerified: boolean;
  rating: number;
  reviewCount: number;
}

export default function FarmerCard({
  id, farmerName, farmName, location, bio, image,
  productCount, certifications, isVerified, rating, reviewCount,
}: FarmerCardProps) {
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(rating) ? "⭐" : "☆").join("");

  return (
    <article
      id={`farmer-card-${id}`}
      style={{
        background: "var(--color-white)",
        borderRadius: "24px",
        padding: "1.75rem",
        boxShadow: "var(--shadow-card)",
        border: "1px solid var(--color-border)",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-hover)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card)";
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <img
            src={image}
            alt={farmerName}
            style={{ width: "68px", height: "68px", borderRadius: "50%", objectFit: "cover", border: "3px solid var(--color-mint)" }}
          />
          {isVerified && (
            <span style={{
              position: "absolute", bottom: 0, right: -2,
              background: "var(--color-forest)", color: "#fff",
              borderRadius: "50%", width: "20px", height: "20px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.65rem", border: "2px solid white",
            }}>
              ✓
            </span>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.05rem", fontWeight: 700, color: "var(--color-text-dark)" }}>
              {farmerName}
            </h3>
            {isVerified && (
              <span style={{ fontSize: "0.68rem", background: "#D8F3DC", color: "#2D6A4F", padding: "1px 8px", borderRadius: "50px", fontWeight: 700 }}>
                Verified
              </span>
            )}
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--color-forest)", fontWeight: 600, margin: "2px 0" }}>{farmName}</p>
          <p style={{ fontSize: "0.78rem", color: "var(--color-text-light)" }}>📍 {location}</p>
        </div>
      </div>

      {/* Rating */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ fontSize: "0.85rem" }}>{stars}</span>
        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-text-dark)" }}>{rating.toFixed(1)}</span>
        <span style={{ fontSize: "0.75rem", color: "var(--color-text-light)" }}>({reviewCount} reviews)</span>
      </div>

      {/* Bio */}
      <p style={{ fontSize: "0.85rem", color: "var(--color-text-mid)", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {bio}
      </p>

      {/* Certifications */}
      {certifications.length > 0 && (
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {certifications.slice(0, 3).map((cert) => (
            <span key={cert} style={{ fontSize: "0.7rem", background: "var(--color-mint)", color: "var(--color-forest)", padding: "3px 10px", borderRadius: "50px", fontWeight: 600 }}>
              {cert}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.5rem", borderTop: "1px solid var(--color-border)" }}>
        <span style={{ fontSize: "0.8rem", color: "var(--color-text-mid)" }}>
          🌾 <strong>{productCount}</strong> products
        </span>
        <Link
          href={`/farmers/${id}`}
          id={`view-farmer-${id}`}
          style={{
            textDecoration: "none",
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "var(--color-forest)",
            border: "2px solid var(--color-forest)",
            padding: "0.4rem 1rem",
            borderRadius: "50px",
            transition: "all 0.25s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--color-forest)";
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--color-forest)";
          }}
        >
          View Profile →
        </Link>
      </div>
    </article>
  );
}
