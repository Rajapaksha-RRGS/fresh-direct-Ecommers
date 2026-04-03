import React from 'react'
import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'
import { ProductCardProps } from '@/components/product/ProductCard'



const page = () => {
    const FEATURED_PRODUCTS: ProductCardProps[] = [
        {
            id: "p1", name: "Baby Spinach", category: "Vegetables",
            basePrice: 220, currentPrice: 264, demandFactor: 1.35,
            unit: "500g", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop",
            harvestDate: new Date(Date.now() - 4 * 3600000).toISOString(),
            farmerId: "f1", farmerName: "Nimal Perera", farmLocation: "Nuwara Eliya",
            stockQty: 28, isOrganic: true,
        },
        {
            id: "p2", name: "King Coconut", category: "Fruits",
            basePrice: 120, currentPrice: 96, demandFactor: 0.8,
            unit: "piece", image: "https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=400&h=300&fit=crop",
            harvestDate: new Date(Date.now() - 8 * 3600000).toISOString(),
            farmerId: "f2", farmerName: "Sudu Banda", farmLocation: "Kurunegala",
            stockQty: 4, isOrganic: false,
        },
        {
            id: "p3", name: "Cherry Tomatoes", category: "Vegetables",
            basePrice: 380, currentPrice: 399, demandFactor: 1.05,
            unit: "kg", image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&h=300&fit=crop",
            harvestDate: new Date(Date.now() - 6 * 3600000).toISOString(),
            farmerId: "f3", farmerName: "Kamala Devi", farmLocation: "Jaffna",
            stockQty: 15, isOrganic: true,
        },
        {
            id: "p4", name: "Red Lotus Rice", category: "Grains",
            basePrice: 560, currentPrice: 560, demandFactor: 1.0,
            unit: "kg", image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&h=300&fit=crop",
            harvestDate: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
            farmerId: "f4", farmerName: "Ravi Kumaran", farmLocation: "Polonnaruwa",
            stockQty: 50, isOrganic: false,
        },
        {
            id: "p5", name: "Murunga Leaves", category: "Herbs",
            basePrice: 80, currentPrice: 104, demandFactor: 1.4,
            unit: "bunch", image: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400&h=300&fit=crop",
            harvestDate: new Date(Date.now() - 2 * 3600000).toISOString(),
            farmerId: "f1", farmerName: "Nimal Perera", farmLocation: "Nuwara Eliya",
            stockQty: 8, isOrganic: true,
        },
        {
            id: "p6", name: "Pineapple", category: "Fruits",
            basePrice: 350, currentPrice: 315, demandFactor: 0.9,
            unit: "piece", image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=300&fit=crop",
            harvestDate: new Date(Date.now() - 12 * 3600000).toISOString(),
            farmerId: "f5", farmerName: "Saman Wickrama", farmLocation: "Gampaha",
            stockQty: 22, isOrganic: false,
        },
    ];

    return (
        <section id="marketplace" style={{ padding: "5rem 1.5rem", background: "var(--color-white)" }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-forest)", textTransform: "uppercase", letterSpacing: "0.12em" }}>Live Marketplace</span>
                        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, color: "var(--color-text-dark)", marginTop: "0.4rem" }}>
                            Fresh From the Fields Today
                        </h2>
                        <p style={{ fontSize: "0.9rem", color: "var(--color-text-mid)", marginTop: "0.25rem" }}>Prices update dynamically based on real-time demand</p>
                    </div>

                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
                    {FEATURED_PRODUCTS.map((product) => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default page