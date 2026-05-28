import { expect, test } from "@playwright/test";

test.describe("API smoke", () => {
  test("products endpoints return seeded data", async ({ request }) => {
    const list = await request.get("/api/products");
    expect(list.status()).toBe(200);
    const listPayload = await list.json();
    expect(Array.isArray(listPayload.data)).toBe(true);
    expect(listPayload.data.length).toBeGreaterThan(0);

    const detail = await request.get("/api/products/digital-thermometer");
    expect(detail.status()).toBe(200);
    const detailPayload = await detail.json();
    expect(detailPayload.data.slug).toBe("digital-thermometer");
  });

  test("blog endpoints return seeded posts", async ({ request }) => {
    const list = await request.get("/api/blog");
    expect(list.status()).toBe(200);
    const listPayload = await list.json();
    expect(Array.isArray(listPayload.data)).toBe(true);
    expect(listPayload.data.length).toBeGreaterThan(0);

    const detail = await request.get("/api/blog/digital-thermometer");
    expect(detail.status()).toBe(200);
    const detailPayload = await detail.json();
    expect(detailPayload.data.slug).toBe("digital-thermometer");
  });

  test("admin collection endpoints respond", async ({ request }) => {
    for (const path of ["/api/orders", "/api/customers", "/api/appointments"]) {
      const response = await request.get(path);
      expect(response.status(), path).toBe(200);
      const payload = await response.json();
      expect(Array.isArray(payload.data), path).toBe(true);
    }
  });

  test("cart accepts add request", async ({ request }) => {
    const response = await request.post("/api/cart", {
      data: { productId: "1", qty: 1 },
    });

    expect(response.status()).toBe(200);
    const payload = await response.json();
    expect(Array.isArray(payload.data)).toBe(true);
    expect(payload.data.some((item: { product: { id: string }; qty: number }) => item.product.id === "1" && item.qty >= 1)).toBe(true);
  });

  test("auth login accepts valid credentials and rejects invalid credentials", async ({ request }) => {
    const valid = await request.post("/api/auth/login", {
      data: { email: "admin@clinic.com", password: "admin123" },
    });
    expect(valid.status()).toBe(200);
    const validPayload = await valid.json();
    expect(validPayload.data.user.email).toBe("admin@clinic.com");

    const invalid = await request.post("/api/auth/login", {
      data: { email: "admin@clinic.com", password: "wrong-password" },
    });
    expect(invalid.status()).toBe(401);
  });
});
