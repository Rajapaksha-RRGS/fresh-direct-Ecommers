# Admin API Testing Guide

## 🧪 One-by-One Testing Instructions

### **Test 1: Fetch All Farmers**

**In browser console:**
```javascript
import { testGetFarmers } from '@/lib/apiTester'
testGetFarmers()
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "ObjectId",
      "farmName": "Hill Top Greens",
      "location": "Nuwara Eliya",
      "status": "PENDING",
      "userName": "Sunil Rajapaksha",
      "userNIC": "901234567V",
      "userMobile": "+94771234567",
      "createdAt": "2026-04-19T10:30:00Z",
      "cropTypes": ["Carrot", "Leeks"]
    }
  ],
  "count": 3
}
```

**Status Codes:**
- `200` ✅ Success
- `401` ❌ No session/not authenticated
- `403` ❌ Not admin user
- `500` ❌ Server error

---

### **Test 2: Fetch Farmers with Status Filter**

**In browser console:**
```javascript
testGetFarmers('PENDING')
```

**Expected:** Only farmers with `status: 'PENDING'`

**Possible status values:** `PENDING`, `APPROVED`, `REJECTED`, `SUSPENDED`

---

### **Test 3: Fetch Analytics Dashboard Data**

**In browser console:**
```javascript
import { testGetAnalytics } from '@/lib/apiTester'
testGetAnalytics()
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "totalActiveFarmers": 142,
    "pendingApprovals": 5,
    "marketLiquidity": 2847,
    "revenueEstimates": 1245680.50,
    "topDemandProducts": [
      {
        "_id": "ObjectId",
        "name": "Fresh Tomatoes",
        "demandScore": 85,
        "stockQty": 120,
        "currentPrice": 145.50
      }
    ]
  },
  "timestamp": "2026-04-21T12:00:00Z"
}
```

**Verifications:**
- ✅ `totalActiveFarmers` > 0
- ✅ `pendingApprovals` ≥ 0
- ✅ `marketLiquidity` is total kg in stock
- ✅ `revenueEstimates` is realistic number

---

### **Test 4: Fetch All Products (sorted by demand)**

**In browser console:**
```javascript
import { testGetProducts } from '@/lib/apiTester'
testGetProducts()
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "ObjectId",
      "name": "Baby Spinach",
      "category": "vegetables",
      "status": "APPROVED",
      "basePrice": 110,
      "currentPrice": 143,
      "stockQty": 42,
      "demandScore": 85,
      "totalSold": 450,
      "farmerName": "Sunil Rajapaksha",
      "farmerId": "ObjectId"
    }
  ],
  "count": 24,
  "pagination": {
    "limit": 100,
    "sortBy": "demandScore",
    "order": "desc"
  }
}
```

**Verifications:**
- ✅ Data is sorted by `demandScore` descending
- ✅ All products have farmer names
- ✅ Status codes are valid

---

### **Test 5: Fetch Products (sorted by Low Stock)**

**In browser console:**
```javascript
testGetProducts('stockQty', 'asc')
```

**Expected:** Products sorted by lowest stockQty first

**Use case:** Find products running low on inventory

---

### **Test 6: Fetch Pricing Configuration**

**In browser console:**
```javascript
import { testGetPricingConfig } from '@/lib/apiTester'
testGetPricingConfig()
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "demandSensitivity": 0.01,
    "supplySensitivity": 0.005,
    "lastModifiedAt": "2026-04-21T12:00:00Z",
    "lastModifiedBy": {
      "_id": "ObjectId",
      "name": "Admin User",
      "email": "admin@freshdirect.lk"
    }
  }
}
```

**Verifications:**
- ✅ `demandSensitivity` is between 0-1
- ✅ `supplySensitivity` is between 0-1
- ✅ Admin info is populated

---

### **Test 7: Update Pricing Configuration**

**In browser console:**
```javascript
import { testPatchPricingConfig } from '@/lib/apiTester'

// Increase demand sensitivity
testPatchPricingConfig(0.015, 0.005)
```

**Request Body:**
```json
{
  "demandSensitivity": 0.015,
  "supplySensitivity": 0.005
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Pricing configuration updated successfully",
  "data": {
    "demandSensitivity": 0.015,
    "supplySensitivity": 0.005,
    "lastModifiedAt": "2026-04-21T13:45:00Z"
  }
}
```

**Verifications:**
- ✅ Values saved correctly
- ✅ `lastModifiedAt` updated
- ✅ Next fetch returns new values

---

### **Test 8: Approve a Farmer**

**In browser console:**
```javascript
// First, get a farmer ID from Test 1
const farmer = farmers[0]._id

import { testPatchVerifyFarmer } from '@/lib/apiTester'
testPatchVerifyFarmer(farmer, 'APPROVE')
```

**Request Body:**
```json
{
  "action": "APPROVE"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Farmer approved successfully",
  "data": {
    "status": "APPROVED",
    "approvedAt": "2026-04-21T13:50:00Z",
    "approvedBy": "ObjectId",
    "isVerified": true
  }
}
```

**Verifications:**
- ✅ Status changed to `APPROVED`
- ✅ `approvedAt` is current timestamp
- ✅ `isVerified` set to true
- ✅ `approvedBy` is admin user ID

---

### **Test 9: Reject a Farmer**

**In browser console:**
```javascript
// Get another farmer
const farmer = farmers[1]._id

testPatchVerifyFarmer(farmer, 'REJECT', 'Documentation incomplete')
```

**Request Body:**
```json
{
  "action": "REJECT",
  "reason": "Documentation incomplete"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Farmer rejected successfully",
  "data": {
    "status": "REJECTED",
    "rejectionReason": "Documentation incomplete",
    "approvedBy": "ObjectId"
  }
}
```

---

## 🚀 Run All Tests at Once

**In browser console:**
```javascript
import { runAllTests } from '@/lib/apiTester'
runAllTests()
```

This will run all 7 tests sequentially and print a summary:
```
🚀 Starting Admin API Test Suite

🧪 Testing: /api/admin/farmers
[✅ PASS] Status 200, 3 farmers returned, 125ms

...

📊 Test Summary: 7 Passed, 0 Failed out of 7 tests
```

---

## 📋 Checklist for Integration

- [ ] All farmers endpoint tests pass (GET, filtering)
- [ ] All analytics endpoint tests pass
- [ ] All products endpoint tests pass (with sorting)
- [ ] Pricing config fetch works
- [ ] Pricing config update works (values persist)
- [ ] Farmer approval/rejection works
- [ ] Dashboard displays real data (not static)
- [ ] Loading states show while fetching
- [ ] Error messages display if APIs fail
- [ ] Notification badge updates with pending farmers

---

## 🔍 Debugging Tips

### Issue: 401 Unauthorized
**Cause:** Not logged in as admin user
**Solution:** 
1. Log in with admin account
2. Check NextAuth session is valid
3. Verify User.role = 'ADMIN' in database

### Issue: No data displayed
**Cause:** Database may be empty
**Solution:**
1. Check MongoDB connection
2. Verify farmers exist with status: 'PENDING'
3. Verify products exist with status: 'APPROVED'

### Issue: Pricing config returns 500
**Cause:** PricingConfig document doesn't exist yet
**Solution:**
1. First PATCH request will create it
2. Or manually insert: `{ demandSensitivity: 0.01, supplySensitivity: 0.005 }`

### Issue: Farmer verification fails
**Cause:** Invalid farmer ID format
**Solution:**
1. Copy exact `_id` from GET /api/admin/farmers
2. Ensure it's a valid MongoDB ObjectId

---

## 📊 Dashboard Integration Test

1. Navigate to `/app/admin/dashboard`
2. Check stat cards update with real numbers
3. Check pending farmers table populates
4. Check pricing table shows real products
5. Verify error alerts display if any API fails
6. Check loading skeletons appear while fetching

---

## 🎯 Success Criteria

✅ All endpoints return 200 with correct data  
✅ Dashboard displays live data, not static  
✅ Approve/Reject farmers updates database  
✅ Pricing config persists across refreshes  
✅ Error handling works gracefully  
✅ Loading states provide good UX  
✅ All localized messages (EN + Sinhala)  

---

**Created:** 2026-04-21  
**Status:** Ready for integration testing
