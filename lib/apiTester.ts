/**
 * lib/apiTester.ts — Admin API Testing Utilities
 *
 * Provides functions to test each endpoint one by one with detailed logging.
 * Run in browser console or Node.js environment.
 */

export interface ApiTestResult {
  endpoint: string;
  status: "✅ PASS" | "❌ FAIL";
  statusCode?: number;
  data?: any;
  error?: string;
  duration: number; // ms
}

/**
 * Test 1: GET /api/admin/farmers
 */
export async function testGetFarmers(
  status?: string
): Promise<ApiTestResult> {
  const startTime = performance.now();
  const endpoint = `/api/admin/farmers${status ? `?status=${status}` : ""}`;

  try {
    console.log(`🧪 Testing: ${endpoint}`);
    const res = await fetch(endpoint);
    const data = await res.json();

    const result: ApiTestResult = {
      endpoint,
      status: res.ok ? "✅ PASS" : "❌ FAIL",
      statusCode: res.status,
      data,
      duration: Math.round(performance.now() - startTime),
    };

    console.log(result);
    return result;
  } catch (err) {
    const result: ApiTestResult = {
      endpoint,
      status: "❌ FAIL",
      error: err instanceof Error ? err.message : "Unknown error",
      duration: Math.round(performance.now() - startTime),
    };

    console.error(result);
    return result;
  }
}

/**
 * Test 2: GET /api/admin/analytics
 */
export async function testGetAnalytics(): Promise<ApiTestResult> {
  const startTime = performance.now();
  const endpoint = "/api/admin/analytics";

  try {
    console.log(`🧪 Testing: ${endpoint}`);
    const res = await fetch(endpoint);
    const data = await res.json();

    const result: ApiTestResult = {
      endpoint,
      status: res.ok ? "✅ PASS" : "❌ FAIL",
      statusCode: res.status,
      data,
      duration: Math.round(performance.now() - startTime),
    };

    console.log(result);
    return result;
  } catch (err) {
    const result: ApiTestResult = {
      endpoint,
      status: "❌ FAIL",
      error: err instanceof Error ? err.message : "Unknown error",
      duration: Math.round(performance.now() - startTime),
    };

    console.error(result);
    return result;
  }
}

/**
 * Test 3: GET /api/admin/products
 */
export async function testGetProducts(
  sortBy: "demandScore" | "stockQty" | "currentPrice" | "totalSold" = "demandScore",
  order: "asc" | "desc" = "desc"
): Promise<ApiTestResult> {
  const startTime = performance.now();
  const endpoint = `/api/admin/products?sortBy=${sortBy}&order=${order}`;

  try {
    console.log(`🧪 Testing: ${endpoint}`);
    const res = await fetch(endpoint);
    const data = await res.json();

    const result: ApiTestResult = {
      endpoint,
      status: res.ok ? "✅ PASS" : "❌ FAIL",
      statusCode: res.status,
      data,
      duration: Math.round(performance.now() - startTime),
    };

    console.log(result);
    return result;
  } catch (err) {
    const result: ApiTestResult = {
      endpoint,
      status: "❌ FAIL",
      error: err instanceof Error ? err.message : "Unknown error",
      duration: Math.round(performance.now() - startTime),
    };

    console.error(result);
    return result;
  }
}

/**
 * Test 4: GET /api/admin/pricing/config
 */
export async function testGetPricingConfig(): Promise<ApiTestResult> {
  const startTime = performance.now();
  const endpoint = "/api/admin/pricing/config";

  try {
    console.log(`🧪 Testing: ${endpoint}`);
    const res = await fetch(endpoint);
    const data = await res.json();

    const result: ApiTestResult = {
      endpoint,
      status: res.ok ? "✅ PASS" : "❌ FAIL",
      statusCode: res.status,
      data,
      duration: Math.round(performance.now() - startTime),
    };

    console.log(result);
    return result;
  } catch (err) {
    const result: ApiTestResult = {
      endpoint,
      status: "❌ FAIL",
      error: err instanceof Error ? err.message : "Unknown error",
      duration: Math.round(performance.now() - startTime),
    };

    console.error(result);
    return result;
  }
}

/**
 * Test 5: PATCH /api/admin/pricing/config
 */
export async function testPatchPricingConfig(
  demandSensitivity?: number,
  supplySensitivity?: number
): Promise<ApiTestResult> {
  const startTime = performance.now();
  const endpoint = "/api/admin/pricing/config (PATCH)";

  try {
    console.log(`🧪 Testing: ${endpoint}`);
    const res = await fetch("/api/admin/pricing/config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ demandSensitivity, supplySensitivity }),
    });
    const data = await res.json();

    const result: ApiTestResult = {
      endpoint,
      status: res.ok ? "✅ PASS" : "❌ FAIL",
      statusCode: res.status,
      data,
      duration: Math.round(performance.now() - startTime),
    };

    console.log(result);
    return result;
  } catch (err) {
    const result: ApiTestResult = {
      endpoint,
      status: "❌ FAIL",
      error: err instanceof Error ? err.message : "Unknown error",
      duration: Math.round(performance.now() - startTime),
    };

    console.error(result);
    return result;
  }
}

/**
 * Test 6: PATCH /api/admin/farmers/[id]/verify
 * Note: Replace FARMER_ID with actual farmer ID from test 1
 */
export async function testPatchVerifyFarmer(
  farmerId: string,
  action: "APPROVE" | "REJECT",
  reason?: string
): Promise<ApiTestResult> {
  const startTime = performance.now();
  const endpoint = `/api/admin/farmers/${farmerId}/verify (PATCH)`;

  try {
    console.log(`🧪 Testing: ${endpoint}`);
    const res = await fetch(`/api/admin/farmers/${farmerId}/verify`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, reason }),
    });
    const data = await res.json();

    const result: ApiTestResult = {
      endpoint,
      status: res.ok ? "✅ PASS" : "❌ FAIL",
      statusCode: res.status,
      data,
      duration: Math.round(performance.now() - startTime),
    };

    console.log(result);
    return result;
  } catch (err) {
    const result: ApiTestResult = {
      endpoint,
      status: "❌ FAIL",
      error: err instanceof Error ? err.message : "Unknown error",
      duration: Math.round(performance.now() - startTime),
    };

    console.error(result);
    return result;
  }
}

/**
 * Run all tests sequentially
 */
export async function runAllTests(): Promise<ApiTestResult[]> {
  console.log("🚀 Starting Admin API Test Suite\n");
  const results: ApiTestResult[] = [];

  // Test 1: Get farmers (all)
  results.push(await testGetFarmers());
  console.log("\n");

  // Test 2: Get farmers (filtered by PENDING)
  results.push(await testGetFarmers("PENDING"));
  console.log("\n");

  // Test 3: Get analytics
  results.push(await testGetAnalytics());
  console.log("\n");

  // Test 4: Get products
  results.push(await testGetProducts());
  console.log("\n");

  // Test 5: Get products (sorted by stockQty)
  results.push(await testGetProducts("stockQty", "asc"));
  console.log("\n");

  // Test 6: Get pricing config
  results.push(await testGetPricingConfig());
  console.log("\n");

  // Test 7: Update pricing config
  results.push(await testPatchPricingConfig(0.012, 0.006));
  console.log("\n");

  // Print summary
  const passed = results.filter((r) => r.status === "✅ PASS").length;
  const failed = results.filter((r) => r.status === "❌ FAIL").length;

  console.log("═".repeat(60));
  console.log(
    `\n📊 Test Summary: ${passed} Passed, ${failed} Failed out of ${results.length} tests\n`
  );
  console.log("═".repeat(60));

  return results;
}

/**
 * Export for browser console usage:
 * window.adminApiTester = require('/lib/apiTester')
 * window.adminApiTester.runAllTests()
 */
