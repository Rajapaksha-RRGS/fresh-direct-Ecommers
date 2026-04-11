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
      className="group bg-white rounded-[24px] p-7 lg:p-8 shadow-[0_4px_20px_rgba(45,106,79,0.06)] border border-[#D0EDD8] transition-all duration-300 flex flex-col gap-5 hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(45,106,79,0.16)]"
    >
      {/* Header */}
      <div className="flex gap-4 items-start">
        <div className="relative flex-shrink-0">
          <img
            src={image}
            alt={farmerName}
            className="w-[72px] h-[72px] rounded-full object-cover border-[3px] border-[#D8F3DC] transition-all duration-300 group-hover:border-[#52B788]"
          />
          {isVerified && (
            <span className="absolute bottom-0 -right-0.5 bg-[#2D6A4F] text-white rounded-full w-5 h-5 flex items-center justify-center text-[0.65rem] border-2 border-white shadow-sm">
              ✓
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className="text-[1.08rem] font-bold text-[#1A2E22] m-0"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {farmerName}
            </h3>
            {isVerified && (
              <span className="text-[0.68rem] bg-[#D8F3DC] text-[#2D6A4F] px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap">
                Verified
              </span>
            )}
          </div>
          <p className="text-[0.85rem] text-[#2D6A4F] font-semibold mt-1 m-0">{farmName}</p>
          <p className="text-[0.78rem] text-[#8FAF9A] m-0 mt-0.5">📍 {location}</p>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2.5">
        <span className="text-[0.85rem]">{stars}</span>
        <span className="text-[0.82rem] font-bold text-[#1A2E22]">{rating.toFixed(1)}</span>
        <span className="text-[0.75rem] text-[#8FAF9A]">({reviewCount} reviews)</span>
      </div>

      {/* Bio */}
      <p className="text-[0.88rem] text-[#4A6355] leading-[1.7] line-clamp-2 m-0">
        {bio}
      </p>

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {certifications.slice(0, 3).map((cert) => (
            <span
              key={cert}
              className="text-[0.72rem] bg-[#D8F3DC] text-[#2D6A4F] px-3 py-1 rounded-full font-semibold"
            >
              {cert}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-[#D0EDD8] mt-auto">
        <span className="text-[0.82rem] text-[#4A6355]">
          🌾 <strong className="text-[#1A2E22]">{productCount}</strong> products
        </span>
        <Link
          href={`/farmers/${id}`}
          id={`view-farmer-${id}`}
          className="no-underline text-[0.85rem] font-bold text-[#2D6A4F] border-2 border-[#2D6A4F] px-5 py-2 rounded-full transition-all duration-200 hover:bg-[#2D6A4F] hover:text-white hover:-translate-y-0.5"
        >
          View Profile →
        </Link>
      </div>
    </article>
  );
}
