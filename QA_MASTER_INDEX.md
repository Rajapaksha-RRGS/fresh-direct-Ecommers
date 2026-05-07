# Fresh Direct E-Commerce: Master QA Test Documentation
## Complete Test Case Reference & Index

**Generated**: 2024
**Total Test Cases**: 72
**Coverage**: 10 Modules | 45 Functional + 27 Negative Tests
**Execution Time**: ~14 days (2-3 days per major module phase)

---

## 📑 Document Organization

This comprehensive QA suite is organized in 3 parts for manageability:

### **Part 1: Fundamentals (Modules 1-3)**
- Authentication & User Management
- Product Management
- Cart Management
- Database seed scripts
- Environment setup instructions

📄 **File**: `QA_TEST_CASES_PART1.md`

### **Part 2: Core Business (Modules 4-6)**
- Order Management
- Payment Processing
- Farmer Profile & Onboarding
- Complete test scenarios with UI mockups

📄 **File**: `QA_TEST_CASES_PART2.md`

### **Part 3: Advanced + Summary (Modules 7-10)**
- Dynamic Pricing Engine
- Admin Dashboard & Operations
- Review & Rating System
- Notification System
- Summary metrics & execution checklist

📄 **File**: `QA_TEST_CASES_PART3.md`

---

## 🎯 Quick Start Guide

### For First-Time QA Setup:
1. Read Part 1 "SETUP & ENVIRONMENT PREPARATION"
2. Run database seed scripts (MongoDB)
3. Create test users (customer, farmer, admin)
4. Start with authentication tests (FRESH-AUTH)

### For Regression Testing:
→ Use "Regression Test Suite" at end of Part 3 (30-min smoke test)

### For Specific Module Testing:
→ Jump to module section in corresponding part
→ Each module includes: UI specs, functional tests, negative tests

---

## 📊 Test Case Matrix

### Module Breakdown

| # | Module | File | Tests | Priority | Est. Time |
|---|--------|------|-------|----------|-----------|
| 1 | **Authentication** | Part 1 | 8 | HIGH | 1-2 days |
| 2 | **Products** | Part 1 | 8 | HIGH | 1-2 days |
| 3 | **Cart** | Part 1 | 8 | HIGH | 1-2 days |
| 4 | **Orders** | Part 2 | 8 | HIGH | 1-2 days |
| 5 | **Payments** | Part 2 | 7 | HIGH | 1-2 days |
| 6 | **Farmer Profile** | Part 2 | 8 | MEDIUM | 1 day |
| 7 | **Pricing** | Part 3 | 6 | MEDIUM | 1 day |
| 8 | **Admin** | Part 3 | 7 | MEDIUM | 1 day |
| 9 | **Reviews** | Part 3 | 5 | MEDIUM | 1 day |
| 10 | **Notifications** | Part 3 | 4 | LOW | 1 day |

---

## 🔍 Test ID Reference (All 72 Tests)

### Authentication (FRESH-AUTH)
```
✓ FRESH-AUTH-001: Customer Login via Google OAuth
✓ FRESH-AUTH-002: Farmer Login via Email/Password
✓ FRESH-AUTH-003: Admin Login
✓ FRESH-AUTH-004: Customer Registration via Email
✓ FRESH-AUTH-005: User Logout
✓ FRESH-AUTH-NEG-001: Invalid Email Format
✓ FRESH-AUTH-NEG-002: Incorrect Password
✓ FRESH-AUTH-NEG-003: Duplicate Email Registration
```

### Products (FRESH-PROD)
```
✓ FRESH-PROD-001: Browse All Products
✓ FRESH-PROD-002: Search Products by Keyword
✓ FRESH-PROD-003: Filter by Category
✓ FRESH-PROD-004: View Product Detail & Track View
✓ FRESH-PROD-005: Out of Stock Handling
✓ FRESH-PROD-NEG-001: No Products Available
✓ FRESH-PROD-NEG-002: Invalid Product ID
✓ FRESH-PROD-NEG-003: Pending/Rejected Products Hidden
```

### Cart (FRESH-CART)
```
✓ FRESH-CART-001: Add Product to Cart
✓ FRESH-CART-002: Update Item Quantity
✓ FRESH-CART-003: Remove Item from Cart
✓ FRESH-CART-004: Clear Entire Cart
✓ FRESH-CART-005: Cart Persistence After Logout/Login
✓ FRESH-CART-NEG-001: Add Out-of-Stock Item
✓ FRESH-CART-NEG-002: Quantity Exceeds Stock
✓ FRESH-CART-NEG-003: Quantity Below 1
```

### Orders (FRESH-ORDER)
```
✓ FRESH-ORDER-001: Place Order with Valid Address
✓ FRESH-ORDER-002: Track Order Status
✓ FRESH-ORDER-003: View Order History
✓ FRESH-ORDER-004: Cancel Order
✓ FRESH-ORDER-005: Insufficient Stock on Order
✓ FRESH-ORDER-NEG-001: Missing Delivery Address
✓ FRESH-ORDER-NEG-002: Invalid Phone Number
✓ FRESH-ORDER-NEG-003: Empty Cart Checkout
```

### Payments (FRESH-PAY)
```
✓ FRESH-PAY-001: Select Payment Method - LankQR
✓ FRESH-PAY-002: Process Credit Card Payment
✓ FRESH-PAY-003: Cash on Delivery (COD)
✓ FRESH-PAY-004: Payment Failure Handling
✓ FRESH-PAY-NEG-001: Invalid Card Details
✓ FRESH-PAY-NEG-002: Duplicate Payment Attempt
✓ FRESH-PAY-NEG-003: Payment Timeout
```

### Farmer Profile (FRESH-FARM)
```
✓ FRESH-FARM-001: Complete 3-Step Farmer Registration
✓ FRESH-FARM-002: Farmer Profile View & Edit
✓ FRESH-FARM-003: Farmer Dashboard Access (Approval Only)
✓ FRESH-FARM-004: Farmer Add Product (Requires Approved Profile)
✓ FRESH-FARM-005: Farmer View Orders & Statistics
✓ FRESH-FARM-NEG-001: Invalid NIC Format
✓ FRESH-FARM-NEG-002: Duplicate Email Registration
✓ FRESH-FARM-NEG-003: Weak Password
```

### Pricing (FRESH-PRICE)
```
✓ FRESH-PRICE-001: Price Calculation - Demand Impact
✓ FRESH-PRICE-002: Price Calculation - Supply Discount
✓ FRESH-PRICE-003: Base Price Floor (Never Below Base)
✓ FRESH-PRICE-004: Admin Adjust Pricing Sensitivity
✓ FRESH-PRICE-NEG-001: Invalid Sensitivity Factor
✓ FRESH-PRICE-NEG-002: Rounding Precision
```

### Admin (FRESH-ADMIN)
```
✓ FRESH-ADMIN-001: View Pending Farmer Approvals
✓ FRESH-ADMIN-002: Approve Farmer
✓ FRESH-ADMIN-003: Reject Farmer Application
✓ FRESH-ADMIN-004: View All Products & Approve
✓ FRESH-ADMIN-005: View Sales Analytics Dashboard
✓ FRESH-ADMIN-NEG-001: Non-Admin Access Blocked
✓ FRESH-ADMIN-NEG-002: Approve Non-Existent Farmer
```

### Reviews (FRESH-REV)
```
✓ FRESH-REV-001: Add Review to Purchased Product
✓ FRESH-REV-002: Prevent Duplicate Reviews
✓ FRESH-REV-003: Edit Review
✓ FRESH-REV-004: Delete Review
✓ FRESH-REV-NEG-001: Non-Verified Purchase Review Blocked
```

### Notifications (FRESH-NOTIF)
```
✓ FRESH-NOTIF-001: Send Order Confirmation Notification
✓ FRESH-NOTIF-002: Send Product Approval Notification to Farmer
✓ FRESH-NOTIF-003: Track Notification Read Status
✓ FRESH-NOTIF-NEG-001: Notification to Invalid User
```

---

## 🛠️ Test Execution Guide

### Daily Workflow

**Morning Standup**: Review previous day's test results

**Morning (2-3 hours)**: Execute planned test cases from checklist

**Mid-day (1 hour)**: Document results, capture screenshots, note bugs

**Afternoon (2-3 hours)**: Continue testing, investigate failures

**End of Day**: Update test case results, log issues in bug tracking system

### Test Case Template Walkthrough

Each test case includes:
- **Test Case ID** (e.g., FRESH-AUTH-001)
- **Description** (what's being tested)
- **Priority** (HIGH/MEDIUM/LOW)
- **Pre-requisite** (setup before test)
- **Post-Requisite** (expected end state)
- **Step Table** with 6 columns:
  - S.No (step number)
  - Action (what user does)
  - Inputs (data provided)
  - Expected Output (correct result)
  - Actual Output (what actually happened - fill during testing)
  - Test Result (PASS/FAIL)

### Result Recording

For each test, mark in "Test Result" column:
- ✅ **PASS** - All steps completed as expected
- ❌ **FAIL** - Any step did not match expected output
- ⚠️ **BLOCKED** - Unable to test due to dependency/environment issue
- 🔄 **RETESTED** - Re-executed after bug fix

---

## 🐛 Bug Reporting Template

When tests fail, create bug report with:
```
Bug ID: [Ticket Number]
Module: [FRESH-MOD]
Test Case: [Test ID]
Severity: Critical/High/Medium/Low
Steps to Reproduce:
  1. [Step 1]
  2. [Step 2]
  3. [Step 3]
Expected: [What should happen]
Actual: [What actually happened]
Screenshot: [Attached]
Environment: Dev/Staging
Browser: Chrome 120
```

---

## 📈 Test Metrics to Track

| Metric | Target | Formula |
|--------|--------|---------|
| **Test Coverage** | >90% | Tests run / Total tests |
| **Pass Rate** | >95% | Passed tests / Tests run |
| **Defect Density** | <0.5/1000 LOC | Bugs found / Code changes |
| **Execution Efficiency** | 100% | Planned tests / Executed tests |
| **Defect Escape Rate** | <2% | Production bugs / Total bugs found |

---

## 🔐 Data Security Considerations

### PII Protection During Testing
- Never use real customer data in test environment
- Mask email addresses and phone numbers in screenshots
- Clear test data before sharing reports
- Use generic names (e.g., "Test Customer 1")

### Password & Token Management
- Use non-production passwords for test accounts
- Never commit credentials to repository
- Rotate test account passwords monthly
- Revoke test tokens after each test cycle

---

## ⚠️ Known Issues & Limitations

1. **Payment Integration**: Uses mock provider
   - Real LankQR scanning not tested
   - Card validation simplified

2. **Notifications**: Mock SMS/WhatsApp service
   - Actual delivery to phones not verified
   - Only in-app notifications fully tested

3. **Performance**: Baselines set for single-user
   - Concurrent request testing recommended separately
   - Load testing not included

4. **Email**: Mock email service
   - Email content not validated for content

5. **File Uploads**: Limited to small test images
   - Large file handling (>10MB) not tested

---

## 🎓 Training & Onboarding

### For New QA Engineers
1. Read this master index
2. Study Part 1 (foundations)
3. Shadow 1 test cycle with experienced QA
4. Execute 5 test cases under supervision
5. Start executing independently

### Recommended Background
- Basic knowledge of e-commerce flows
- Understanding of SQL (for seed scripts)
- Familiarity with HTTP/REST APIs
- Browser developer tools proficiency

---

## 📞 Support & Escalation

**Test Environment Issues**
→ Contact: DevOps Team

**Test Case Clarifications**
→ Contact: QA Lead

**Product Questions**
→ Contact: Product Manager

**Bug Verification**
→ Contact: Development Team

---

## 📋 Pre-Test Checklist

- [ ] Test environment running
- [ ] Database seeded with test data
- [ ] Test users created and verified
- [ ] Payment gateway mocked
- [ ] Notification service ready
- [ ] Browser cache cleared
- [ ] VPN/Proxy configured (if needed)
- [ ] Test case documents available
- [ ] Test result tracking spreadsheet open
- [ ] Bug tracking system accessible

---

## 🚀 Execution Schedule (Suggested)

**Week 1**: Modules 1-3 (Auth, Products, Cart)
**Week 2**: Modules 4-5 (Orders, Payments)
**Week 3**: Modules 6-8 (Farmer, Admin, Pricing)
**Week 4**: Modules 9-10 + Regression + Documentation

---

## 📝 Test Report Template

```
FRESH DIRECT QA TEST REPORT
Date: 2024-01-15
QA Engineer: [Name]
Environment: Development
Build Version: v1.2.3

SUMMARY:
- Total Tests Executed: 72
- Passed: 68
- Failed: 3
- Blocked: 1
- Pass Rate: 94.4%

HIGH PRIORITY FAILURES:
1. FRESH-PAY-002: Card payment times out (>30s)
2. FRESH-FARM-001: Step 3 form validation broken

RECOMMENDATIONS:
- Investigate payment gateway timeout
- Review form validation in step 3

Next Steps: Retesting after fixes in sprint review
```

---

## 🔄 Continuous Testing

### Daily Smoke Tests
Execute 10-15 critical test cases daily

### Weekly Full Cycle
Execute all 72 tests every Friday

### Per-Release Testing
Full suite before production deployment

### Regression Testing
Run after any code changes

---

## 📚 Additional Resources

### System Architecture Docs
- PlantUML diagrams: See `fresh_direct_plantuml.md`
- Class relationships and use cases

### API Documentation
- Endpoints: `/api/products`, `/api/orders`, `/api/admin/*`
- See backend code in `/app/api/` directory

### Database Schema
- Models in `/models/` directory
- Relationships defined in `/models/User.ts`, etc.

---

## ✅ Sign-Off & Approval

**QA Lead Review**: ___________________  Date: _________

**Test Plan Approval**: ________________  Date: _________

**Project Manager Sign-Off**: __________  Date: _________

---

**Document Version**: 1.0
**Last Updated**: January 2024
**Next Review**: March 2024

**For updates or questions about this test suite, contact the QA Team.**

---

*This comprehensive QA documentation provides complete coverage of the Fresh Direct e-commerce system with 72 test cases, detailed UI specifications, database setup scripts, and execution guidelines.*
