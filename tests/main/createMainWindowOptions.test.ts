import { describe, expect, it } from "vitest";

import { createMainWindowOptions } from "../../src/main/window/createMainWindowOptions";

describe("createMainWindowOptions", () => {
  it("hides the menu bar and keeps the window on a light surface by default", () => {
    const options = createMainWindowOptions("D:/preload/index.mjs");

    expect(options.width).toBe(1280);
    expect(options.height).toBe(800);
    expect(options.autoHideMenuBar).toBe(true);
    expect(options.backgroundColor).toBe("#f3f7fb");
    expect(options.webPreferences?.preload).toBe("D:/preload/index.mjs");
    expect(options.webPreferences?.contextIsolation).toBe(true);
    expect(options.webPreferences?.nodeIntegration).toBe(false);
    expect(options.webPreferences?.sandbox).toBe(false);
  });
});
