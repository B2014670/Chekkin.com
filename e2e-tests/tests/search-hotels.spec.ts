import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5173/"
//login
test.beforeEach(async ({ page }) => {
    await page.goto(UI_URL);
    // get the sign in button
    await page.getByRole("link", { name: "Sign In" }).click();

    await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

    await page.locator("[name=email]").fill("1@1.com");
    await page.locator("[name=password]").fill("123123");

    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Sign in Successful!")).toBeVisible();
    await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
    await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
});

test("search OK", async ({ page }) => {
    await page.goto(`${UI_URL}`);
    await page.locator(".destination").fill("Dublin");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page.getByText("Dublin Getaways")).toBeVisible();
});

test("search NotFound", async ({ page }) => {
    await page.goto(`${UI_URL}`);
    await page.locator(".destination").fill("Dublin");
    await page.getByLabel('Adults:').fill("20");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page.getByText("Not Found")).toBeVisible();
});