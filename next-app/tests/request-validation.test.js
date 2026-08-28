import { describe, expect, it } from "vitest";
import {
  isEmptyJsonObject,
  readJsonRequest,
} from "@/lib/request-validation";

function createRequest(body, contentType = "application/json") {
  return new Request("https://sidequest.test/api/example", {
    method: "POST",
    headers: { "content-type": contentType },
    body,
  });
}

describe("JSON request parsing", () => {
  it("accepts valid JSON with a charset parameter", async () => {
    const result = await readJsonRequest(
      createRequest('{"quest":"Take a walk"}', "application/json; charset=utf-8"),
    );

    expect(result).toEqual({ data: { quest: "Take a walk" } });
  });

  it("rejects the wrong content type", async () => {
    const result = await readJsonRequest(createRequest("{}", "text/plain"));

    expect(result.error.status).toBe(415);
  });

  it("rejects malformed JSON", async () => {
    const result = await readJsonRequest(createRequest("{"));

    expect(result.error.status).toBe(400);
  });

  it("rejects an empty body", async () => {
    const result = await readJsonRequest(createRequest(""));

    expect(result.error.status).toBe(400);
  });

  it("rejects a body larger than the configured byte limit", async () => {
    const result = await readJsonRequest(createRequest(JSON.stringify("ééé")), {
      maxBytes: 5,
    });

    expect(result.error.status).toBe(413);
  });
});

describe("empty JSON command bodies", () => {
  it("accepts only a plain empty object", () => {
    expect(isEmptyJsonObject({})).toBe(true);
    expect(isEmptyJsonObject({ user_id: "forged" })).toBe(false);
    expect(isEmptyJsonObject([])).toBe(false);
    expect(isEmptyJsonObject(null)).toBe(false);
  });
});
