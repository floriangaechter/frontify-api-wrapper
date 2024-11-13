import { describe, expect, it } from "vitest";
import { ERROR_MESSAGES, getBaseUrl } from "./getBaseUrl";

describe("getBaseUrl", () => {
  it("should return correct base URL for a valid HTTPS URL", () => {
    const url = "https://example.com";
    const expected = "https://example.com/graphql";

    expect(getBaseUrl(url)).toBe(expected);
  });

  it("should throw protocol error for an HTTP URL", () => {
    const url = "http://example.com";

    expect(() => getBaseUrl(url)).toThrow(ERROR_MESSAGES.PROTOCOL_ERROR);
  });

  it("should throw base URL error for an invalid URL format", () => {
    const url = "invalid-url";

    expect(() => getBaseUrl(url)).toThrow(ERROR_MESSAGES.BASE_URL_ERROR);
  });

  it("should return correct base URL for a URL with trailing slash", () => {
    const url = "https://example.com/";
    const expected = "https://example.com/graphql";

    expect(getBaseUrl(url)).toBe(expected);
  });

  it("should throw base URL error for an empty string", () => {
    const url = "";

    expect(() => getBaseUrl(url)).toThrow(ERROR_MESSAGES.BASE_URL_ERROR);
  });

  it("should throw base URL error for non-string input", () => {
    const url = 12345;

    expect(() => getBaseUrl(url as unknown as string)).toThrow(
      ERROR_MESSAGES.BASE_URL_ERROR,
    );
  });
});
