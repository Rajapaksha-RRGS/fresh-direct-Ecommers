# Fresh Direct QA: Quick Reference Card
## One-Page Cheat Sheet for QA Engineers

**Print this page or keep it in a tab during testing!**

---

## 📍 Test Environment URLs

| Resource | URL |
|----------|-----|
| **App** | http://localhost:3000 |
| **API** | http://localhost:3000/api |
| **MongoDB** | localhost:27017 |
| **Admin Panel** | /admin/dashboard |
| **Farmer Portal** | /FamerDashbord |

---

## 🧑 Test Users

| Role | Email | Password | Status |
|------|-------|----------|--------|
| **Customer** | customer@test.com | password123 | Active |
| **Farmer** | farmer@test.com | password123 | Approved |
| **Farmer 2** | farmer2@test.com | password123 | Pending |
| **Admin** | admin@test.com | password123 | Active |

---

## 🎯 Test IDs by Priority

### 🔴 CRITICAL (Test First)
- FRESH-AUTH-001, 002, 003 → Login flows
- FRESH-CART-001 → Add to cart
- FRESH-ORDER-001 → Place order
- FRESH-PAY-001, 002 → Payment

### 🟠 HIGH (Test Day 2-3)
- FRESH-PROD-001, 002, 003 → Products
- FRESH-CART-002, 003, 004 → Cart management
- FRESH-ORDER-002, 003 → Order status
- FRESH-FARM-001, 002 → Farmer registration

### 🟡 MEDIUM (Test Day 4-5)
- FRESH-PRICE-001, 002, 003 → Pricing
- FRESH-ADMIN-001, 002, 003 → Admin ops
- FRESH-FARM-003, 004 → Farmer dashboard

### 🟢 LOW (Test Day 6+)
- FRESH-REV-001, 002 → Reviews
- FRESH-NOTIF-001, 002 → Notifications

---

## ✅ Test Result Codes

| Symbol | Meaning | Action |
|--------|---------|--------|
| ✅ | PASS | Mark complete, move to next test |
| ❌ | FAIL | Document bug, create ticket |
| ⚠️ | BLOCKED | Note blocker, escalate to dev |
| 🔄 | RETRY | Test again after fix |

---

## 🐛 Quick Bug Report Template

```
Bug: [Module] [Brief Description]
Test: [FRESH-MOD-###]
Severity: Critical / High / Medium / Low
Reproduce:
  1. [Step]
  2. [Step]
  3. [Step]
Expected: [Result]
Actual: [Result]
Screenshot: [Attach]
```

---

## 🔐 SQL Seeds (Copy-Paste)

### Customer User
```sql
db.users.insertOne({
  email: "customer@test.com",
  passwordHash: "$2b$10$...",
  name: "Test Customer",
  role: "CUSTOMER",
  createdAt: new Date()
})
```

### Test Product
```sql
db.products.insertOne({
  name: "Test Tomatoes",
  category: "vegetables",
  basePrice: 150,
  stockQty: 50,
  status: "APPROVED",
  farmerId: ObjectId("FARMER_ID")
})
```

---

## 🎨 Design Color Reference

| Element | Color Code | Usage |
|---------|-----------|-------|
| Primary | #2D6A4F | Buttons, headers |
| Secondary | #E8F5E9 | Backgrounds |
| Accent | #52B788 | Links, badges |
| Success | #28A745 | Pass, approved |
| Error | #DC3545 | Fail, rejected |

---

## 📊 Test Execution Checklist

**Before Starting:**
- [ ] Environment up and running
- [ ] Database seeded
- [ ] Test users created
- [ ] Browser cache cleared
- [ ] Test result sheet ready

**During Testing:**
- [ ] Follow steps exactly
- [ ] Record actual output
- [ ] Capture screenshots for fails
- [ ] Note timing/performance
- [ ] Check database changes

**After Testing:**
- [ ] Update result status
- [ ] Log any bugs found
- [ ] Update performance metrics
- [ ] Review for pattern failures

---

## ⚡ Performance Targets

| Operation | Target | Status |
|-----------|--------|--------|
| Login | <1s | ✓ |
| Product search | <1s | ✓ |
| Cart add | <500ms | ✓ |
| Checkout | <3s | ✓ |
| Payment process | <5s | ✓ |
| Order confirmation | <1s | ✓ |

---

## 🛑 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| **Login fails** | Clear cookies, retry with correct user |
| **Cart empty after login** | Check localStorage, verify session |
| **Price doesn't update** | Refresh page, check demand score |
| **Payment times out** | Verify payment service running |
| **Form validation fails** | Check browser console for errors |
| **Database seed fails** | Verify MongoDB connection |

---

## 📞 Quick Escalation

| Issue | Contact | Slack |
|-------|---------|-------|
| **Env down** | DevOps | #infrastructure |
| **API bug** | Backend Dev | #development |
| **Payment issues** | Payment Eng | #payments |
| **Test blocker** | QA Lead | #qa |
| **Prod incident** | Engineering Manager | #incidents |

---

## 🔄 Daily Workflow

```
09:00 - 09:15  : Standup, check blockers
09:15 - 12:00  : Execute 10-15 test cases
12:00 - 12:30  : Lunch break
12:30 - 15:30  : Continue testing, document issues
15:30 - 16:00  : Update results, prepare bug report
16:00 - 16:30  : Debrief, plan next day
```

---

## 📋 Module Execution Order (Recommended)

```
Day 1-2:  FRESH-AUTH (Login/Register)
Day 2-3:  FRESH-PROD (Products) + FRESH-CART (Cart)
Day 3-4:  FRESH-ORDER (Orders) + FRESH-PAY (Payment)
Day 5:    FRESH-FARM (Farmer) + FRESH-ADMIN (Admin)
Day 6:    FRESH-PRICE (Pricing) + FRESH-REV (Reviews)
Day 7:    FRESH-NOTIF (Notifications) + Regression
```

---

## 🎓 Pro Tips

✅ **DO:**
- Read entire test case before starting
- Test on multiple browsers (Chrome, Firefox, Safari)
- Check mobile view for responsive tests
- Take screenshots of failures
- Ask questions if unclear

❌ **DON'T:**
- Skip pre-requisite setup steps
- Use real customer data
- Modify test cases on the fly
- Run tests while tired/distracted
- Skip negative test cases

---

## 📊 Weekly Report Template

```
WEEK OF [DATE]:
- Tests Executed: __/72
- Pass Rate: __%
- Bugs Found: __
- Critical Issues: __
- Blockers: __
- On Schedule: YES / NO

Top Issues This Week:
1. [Issue]
2. [Issue]

Next Week Focus:
- [Module/Feature]
```

---

## 🚀 Pre-Production Checklist

- [ ] All 72 tests executed
- [ ] Pass rate ≥95%
- [ ] All critical bugs fixed
- [ ] Regression tests passed
- [ ] Performance targets met
- [ ] Security reviewed
- [ ] Data cleanup done
- [ ] Sign-off obtained

---

## 📞 Support Contacts

| Role | Name | Slack |
|------|------|-------|
| QA Lead | [Name] | @qa-lead |
| Dev Lead | [Name] | @dev-lead |
| Product Manager | [Name] | @pm |
| DevOps | [Name] | @devops |

---

## 📚 Reference Documents

**Full Suite**: QA_TEST_CASES_PART1.md, Part2.md, Part3.md  
**Master Index**: QA_MASTER_INDEX.md  
**System Docs**: fresh_direct_plantuml.md  
**API Endpoints**: /app/api/ directory  

---

**✨ Happy Testing! Remember: Quality is our responsibility. 🎯**

---

*Last Updated: January 2024 | Version 1.0*
