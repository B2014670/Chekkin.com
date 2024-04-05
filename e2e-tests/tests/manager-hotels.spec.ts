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

test("add hotel", async ({ page }) => {
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

test("display hotels", async ({ page }) => {
  await page.goto(`${UI_URL}my-hotels`);
  await expect(page.getByText("Dublin Getaways")).toBeVisible();
  await expect(page.getByText("Lorem ipsum dolor sit amet")).toBeVisible();
  await expect(page.getByText("Dublin, Ireland")).toBeVisible();
  await expect(page.getByText("All Inclusive")).toBeVisible();
  await expect(page.getByText("119 /night")).toBeVisible();
  await expect(page.getByText("2 adults, 3 children")).toBeVisible();
  await expect(page.getByText("2 Star Rating")).toBeVisible();

  await expect(
    page.getByRole("link", { name: "View More" }).first()
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Add Hotel" })).toBeVisible();
});

test("edit ", async ({ page }) => {
  await page.goto(`${UI_URL}my-hotels`);
  await page.getByRole("link", { name: "Edit" }).last().click();
  await expect(page.getByText("Edit Hotel")).toBeVisible();
  await page.waitForSelector('[name="name"]', { state: "attached" });
  await expect(page.locator("[name=name]")).toHaveValue("test hotel name");
  await page.locator("[name=name]").fill("test hotel name UPDATE");
  await page.locator("[name=city]").fill("test city UPDATE");
  await page.locator("[name=country]").fill("test country UPDATE");
  await page.locator("[name=description]").fill("test some description UPDATE");
  await page.locator("[name=pricePerNight]").fill("1");
  await page.selectOption('select[name="starRating"]', "1");
  await page.getByText("SElf Catering").click();
  await page.getByLabel("Fitness Center").check();
  await page.locator("[name=adultCount]").fill("100");
  await page.locator("[name=childCount]").fill("100");

  const imagePath = ['./tests/files/1.jpg'];
  await page.setInputFiles("[name=imageFiles]", imagePath);
  await page.getByRole("button", { name: "Update" }).click();
  await page.locator("[type=submit]").click();
  await expect(page.getByText("Change Hotel Saved!")).toBeVisible();

  await page.reload();
  await expect(page.locator("[name=name]")).toHaveValue("test hotel name UPDATE");
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
  await page.getByRole("button", { name: "Update" }).click();

});

test("delete hotel", async ({ page }) => {
  await page.goto(`${UI_URL}my-hotels`);
  await page.getByRole("button", { name: "Delete" }).last().click();
  await expect(page.getByText("Hotel deleted successfully!")).toBeVisible();
});