import { describe, it, expect, beforeEach, vi } from "vitest";
import { createClient, ERROR_MESSAGES } from "./index"; // Adjust the import path as necessary

describe("createClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws an error if config is missing", async () => {
    // @ts-ignore
    await expect(createClient(undefined)).rejects.toThrow(
      ERROR_MESSAGES.CONFIG_REQUIRED,
    );
  });

  it("throws an error if baseUrl is missing", async () => {
    await expect(createClient({} as any)).rejects.toThrow(
      ERROR_MESSAGES.BASE_URL_REQUIRED,
    );
  });

  it("throws an error if token and clientId are missing in the browser", async () => {
    global.window = {} as any; // Mocking browser environment

    await expect(
      createClient({ baseUrl: "https://example.com" }),
    ).rejects.toThrow(ERROR_MESSAGES.TOKEN_OR_CLIENT_ID_REQUIRED);
  });

  it("throws an error if token is missing in Node.js environment", async () => {
    delete (global as any).window; // Mocking Node.js environment

    await expect(
      createClient({ baseUrl: "https://example.com" }),
    ).rejects.toThrow(ERROR_MESSAGES.TOKEN_NODE_REQUIRED);
  });

  // TODO: add tests for apollo client
});
