# Farmer Approval/Rejection API

## Endpoint

**PATCH** `/api/admin/farmers/[id]`

## Authentication

- **Required Role:** `ADMIN` (enforced by middleware)
- **Header:** `Authorization: Bearer <jwt_token>` (optional with proxy)
- The middleware will automatically verify the admin role before reaching this handler

## Request Body

```json
{
  "status": "APPROVED" | "REJECTED",
  "reason": "Optional rejection reason"
}
```

### Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | string | ✅ Yes | Must be `"APPROVED"` or `"REJECTED"` |
| `reason` | string | ❌ No | Optional rejection reason (only for REJECTED) |

## Response

### Success (200)

```json
{
  "success": true,
  "message": "Farmer approved successfully",
  "messageNL": "ගොවියා අනුමත විය",
  "data": {
    "_id": "farmer_id",
    "userId": "user_id",
    "farmName": "Green Valley Farm",
    "status": "APPROVED",
    "approvedAt": "2026-04-25T10:30:00.000Z",
    "approvedBy": "admin_id",
    "isVerified": true,
    ...
  }
}
```

### Error Cases

**400 Bad Request** — Invalid status
```json
{
  "success": false,
  "message": "Invalid status. Must be 'APPROVED' or 'REJECTED'",
  "messageNL": "වලංගු නොවන තත්ත්වය..."
}
```

**400 Bad Request** — Invalid farmer ID format
```json
{
  "success": false,
  "message": "Invalid farmer ID format",
  "messageNL": "වලංගු නොවන ගොවියා හැඳුනුම්පත් ආකෘතිය"
}
```

**401 Unauthorized** — Not logged in
```json
{
  "success": false,
  "message": "Unauthorized: No active session"
}
```

**403 Forbidden** — Not admin
```json
{
  "success": false,
  "message": "Forbidden: Admin access required"
}
```

**404 Not Found** — Farmer doesn't exist
```json
{
  "success": false,
  "message": "Farmer not found"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Failed to update farmer"
}
```

---

## Usage Examples

### Approve a Farmer

```bash
curl -X PATCH http://localhost:3000/api/admin/farmers/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "status": "APPROVED"
  }'
```

### Reject a Farmer with Reason

```bash
curl -X PATCH http://localhost:3000/api/admin/farmers/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "status": "REJECTED",
    "reason": "Bank details verification failed"
  }'
```

### Using TypeScript/JavaScript

```typescript
import { useAdminApi } from "@/hooks/useAdminApi";

async function approveFarmer(farmerId: string) {
  try {
    const response = await fetch(`/api/admin/farmers/${farmerId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "APPROVED",
      }),
    });

    const result = await response.json();
    console.log("Farmer approved:", result.data);
  } catch (error) {
    console.error("Failed to approve farmer:", error);
  }
}
```

---

## Database Updates

When approval status is changed:

### ✅ On APPROVED:
- `status` → `"APPROVED"`
- `approvedAt` → Current timestamp
- `approvedBy` → Admin user ID
- `isVerified` → `true`

### ❌ On REJECTED:
- `status` → `"REJECTED"`
- `approvedBy` → Admin user ID
- `rejectionReason` → Stored for audit (if provided)

---

## Also Available

**GET** `/api/admin/farmers/[id]` — Fetch full farmer profile (admin only)

```bash
curl http://localhost:3000/api/admin/farmers/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer eyJhbGc..."
```

Returns complete farmer profile including sensitive bank details and user information.

---

## Audit Trail

All actions are logged to console:
```
[ADMIN AUDIT] admin_id updated farmer farmer_id status to APPROVED
```

For production, implement persistent audit logging to a separate collection.
