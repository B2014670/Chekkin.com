import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5173/"

test.beforeEach(async ({ page }) => {
    await page.goto(UI_URL);
    // get the sign in button
    await page.getByRole("link", { name: "Sign In" }).click();

    await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

    await page.locator("[name=email]").fill("1@1.com");
    await page.locator("[name=password]").fill("password123");

    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Sign in Successful!")).toBeVisible();
    await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
    await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
});

test("User add a hotel", async ({ page }) => {
    await page.goto(`${UI_URL}add-hotel`);
    await page.locator("[name=name]").fill("test hotel name");
    await page.locator("[name=city]").fill("test city");
    await page.locator("[name=country]").fill("test country");
    await page.locator("[name=description]").fill("test some description");
    await page.locator("[name=pricePerNight]").fill("100");
    await page.selectOption('select[name="starRating"]', "4");
    await page.getByText("Budget").click();
    await page.getByLabel("Free WiFi").check();
    await page.locator("[name=adultCount]").fill("2");
    await page.locator("[name=childCount]").fill("1");

    const imagePaths = ['./tests/files/1.jpg', './tests/files/2.jpg'];
    await page.setInputFiles("[name=imageFiles]", imagePaths);
    await page.getByRole("button", { name: "Save" }).click();
    await page.locator("[type=submit]").click();

    await expect(page.getByText("Hotel Saved!")).toBeVisible();


});