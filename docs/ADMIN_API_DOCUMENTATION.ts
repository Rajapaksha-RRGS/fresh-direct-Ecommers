/**
 * ADMIN DASHBOARD API SUITE — Complete Documentation
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * 1. FARMER MANAGEMENT ENDPOINTS
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * GET /api/admin/farmers
 * ─────────────────────────
 * Description: Retrieve all farmers with optional status filtering
 * Query Parameters:
 *   - status: Optional filter by status (PENDING, APPROVED, REJECTED, SUSPENDED)
 *
 * Example: GET /api/admin/farmers?status=PENDING
 *
 * Response (200):
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "_id": "ObjectId",
 *       "farmName": "Nuwara Farms",
 *       "location": "Kandy",
 *       "status": "PENDING",
 *       "approvedAt": null,
 *       "createdAt": "2026-04-15T10:30:00Z",
 *       "userId": "ObjectId",
 *       "userName": "Ajith Silva",
 *       "userNIC": "982345123V",
 *       "userMobile": "+94771234567",
 *       "isVerified": false,
 *       "cropTypes": ["vegetables", "fruits"]
 *     }
 *   ],
 *   "count": 3
 * }
 *
 *
 * PATCH /api/admin/farmers/[id]/verify
 * ─────────────────────────────────────
 * Description: Approve or reject a farmer application
 * Path Parameters:
 *   - id: FarmerProfile MongoDB ObjectId
 *
 * Request Body:
 * {
 *   "action": "APPROVE" | "REJECT",
 *   "reason": "Optional rejection reason for audit trail"
 * }
 *
 * Response (200):
 * {
 *   "success": true,
 *   "message": "Farmer approved successfully",
 *   "messageNL": "ගොවියා අනුමත විය",
 *   "data": {
 *     "_id": "ObjectId",
 *     "status": "APPROVED",
 *     "approvedAt": "2026-04-21T12:00:00Z",
 *     "approvedBy": "ObjectId"
 *   }
 * }
 *
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * 2. ANALYTICS & SUMMARY ENDPOINT
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * GET /api/admin/analytics
 * ────────────────────────
 * Description: High-level dashboard summary with KPIs
 * No parameters required
 *
 * Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "totalActiveFarmers": 142,
 *     "pendingApprovals": 5,
 *     "marketLiquidity": 2847,        // Total stockQty across all approved products
 *     "revenueEstimates": 1245680.50, // Sum of (basePrice * totalSold)
 *     "topDemandProducts": [
 *       {
 *         "_id": "ObjectId",
 *         "name": "Fresh Tomatoes",
 *         "demandScore": 85,
 *         "stockQty": 120,
 *         "currentPrice": 145.50
 *       }
 *     ]
 *   },
 *   "timestamp": "2026-04-21T12:00:00Z"
 * }
 *
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * 3. DYNAMIC PRICING CONTROL
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * GET /api/admin/pricing/config
 * ────────────────────────────
 * Description: Fetch current global pricing sensitivity factors
 *
 * Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "demandSensitivity": 0.01,      // α factor
 *     "supplySensitivity": 0.005,     // β factor
 *     "lastModifiedAt": "2026-04-15T08:30:00Z",
 *     "lastModifiedBy": {
 *       "_id": "ObjectId",
 *       "name": "Admin User",
 *       "email": "admin@freshdirect.lk"
 *     }
 *   }
 * }
 *
 *
 * PATCH /api/admin/pricing/config
 * ────────────────────────────────
 * Description: Update pricing sensitivity factors
 *
 * Request Body:
 * {
 *   "demandSensitivity": 0.01,   // Optional, must be 0-1
 *   "supplySensitivity": 0.005   // Optional, must be 0-1
 * }
 *
 * Response (200):
 * {
 *   "success": true,
 *   "message": "Pricing configuration updated successfully",
 *   "messageNL": "මිල ගණන් වින්‍යාසය සඳහා සිදු කරන ලදි",
 *   "data": {
 *     "demandSensitivity": 0.01,
 *     "supplySensitivity": 0.005,
 *     "lastModifiedAt": "2026-04-21T12:00:00Z"
 *   }
 * }
 *
 * Notes on Pricing Formula:
 * • Formula: P_final = P_base × (1 + (α × demandScore) − (β × stockQty))
 * • P_final is NEVER lower than P_base (price floor protection)
 * • α (Demand Sensitivity): How much demand affects price (default: 0.01)
 * • β (Supply Sensitivity): How much stock reduces price (default: 0.005)
 * • High demand + low stock = premium pricing
 * • Low demand + high stock = price reduction (but not below base)
 *
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * 4. PRODUCT OVERSIGHT
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * GET /api/admin/products
 * ──────────────────────
 * Description: Monitor all marketplace products with farmer info
 * Query Parameters (all optional):
 *   - sortBy: 'demandScore' | 'stockQty' | 'currentPrice' | 'totalSold' (default: demandScore)
 *   - order: 'asc' | 'desc' (default: desc)
 *   - status: filter by product status (PENDING, APPROVED, REJECTED, OUT_OF_STOCK)
 *   - limit: max results (default: 100, max: 500)
 *
 * Examples:
 * • GET /api/admin/products?sortBy=demandScore&order=desc
 * • GET /api/admin/products?status=APPROVED&sortBy=stockQty&order=asc
 * • GET /api/admin/products?limit=50
 *
 * Response (200):
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "_id": "ObjectId",
 *       "name": "Fresh Tomatoes",
 *       "category": "vegetables",
 *       "status": "APPROVED",
 *       "basePrice": 120,
 *       "currentPrice": 145.50,
 *       "stockQty": 150,
 *       "demandScore": 85,
 *       "totalSold": 420,
 *       "farmerName": "Ajith Silva",
 *       "farmerId": "ObjectId",
 *       "createdAt": "2026-04-10T14:30:00Z"
 *     }
 *   ],
 *   "count": 1,
 *   "pagination": {
 *     "limit": 100,
 *     "sortBy": "demandScore",
 *     "order": "desc"
 *   }
 * }
 *
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * ERROR RESPONSES
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * 401 Unauthorized (No session):
 * {
 *   "success": false,
 *   "message": "Unauthorized: No active session",
 *   "messageNL": "අවසරයි නැත: ක්‍රියාකාරී සැසිය නැත"
 * }
 *
 * 403 Forbidden (Not admin):
 * {
 *   "success": false,
 *   "message": "Forbidden: Admin access required",
 *   "messageNL": "තහනම්: පරිපාලක ප්‍රවේශය අවශ්‍ය"
 * }
 *
 * 400 Bad Request (Invalid input):
 * {
 *   "success": false,
 *   "message": "Invalid farmer ID format",
 *   "messageNL": "වලංගු නොවන ගොවියා හැඳුනුම්පත් ආකෘතිය"
 * }
 *
 * 404 Not Found:
 * {
 *   "success": false,
 *   "message": "Farmer not found",
 *   "messageNL": "ගොවියා සොයා ගැනීමට නොහැකි විය"
 * }
 *
 * 500 Internal Server Error:
 * {
 *   "success": false,
 *   "message": "Failed to fetch farmers",
 *   "messageNL": "ගොවීන් ලබා ගැනීම අසබල විය"
 * }
 *
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * SECURITY & IMPLEMENTATION NOTES
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Authentication:
 * • All endpoints require NextAuth session with ADMIN role
 * • Verified via middleware/adminAuth.ts
 * • Session email must match a User with role: "ADMIN"
 *
 * Efficiency:
 * • Farmer management uses aggregation with $lookup instead of multiple queries
 * • Product listings use .populate('farmerId', 'name') for efficient farmer lookups
 * • Analytics query groups and sums using $group stage
 * • All responses limited to essential fields only
 *
 * Error Handling:
 * • All endpoints return localized error messages (English + Sinhala)
 * • HTTP status codes follow RESTful conventions
 * • Request validation happens before database queries
 *
 * Audit Logging:
 * • Admin actions logged to console (extensible to database)
 * • Farmer verification logs include admin ID and action
 * • Pricing config changes logged with old/new values
 *
 * Data Validation:
 * • Pricing factors (α, β) constrained to [0, 1] range
 * • Farmer status must match enum values
 * • Product sorting limited to whitelisted fields
 * • Pagination limits enforced (1-500 products per request)
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export {}; // File is documentation only
