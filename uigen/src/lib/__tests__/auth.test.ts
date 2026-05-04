import { test, expect, vi, beforeEach } from "vitest";
import { jwtVerify } from "jose";

vi.mock("server-only", () => ({}));

const { mockSet } = vi.hoisted(() => ({ mockSet: vi.fn() }));

vi.mock("next/headers", () => ({
  cookies: () =>
    Promise.resolve({
      set: mockSet,
      get: vi.fn(),
      delete: vi.fn(),
    }),
}));

import { createSession } from "@/lib/auth";

const JWT_SECRET = new TextEncoder().encode("development-secret-key");

beforeEach(() => {
  mockSet.mockClear();
});

test("createSession sets a cookie named auth-token", async () => {
  await createSession("user-1", "user@example.com");

  expect(mockSet).toHaveBeenCalledOnce();
  const [name] = mockSet.mock.calls[0];
  expect(name).toBe("auth-token");
});

test("createSession cookie is httpOnly with path /", async () => {
  await createSession("user-1", "user@example.com");

  const [, , options] = mockSet.mock.calls[0];
  expect(options.httpOnly).toBe(true);
  expect(options.path).toBe("/");
});

test("createSession cookie sameSite is lax", async () => {
  await createSession("user-1", "user@example.com");

  const [, , options] = mockSet.mock.calls[0];
  expect(options.sameSite).toBe("lax");
});

test("createSession cookie expires approximately 7 days from now", async () => {
  const before = Date.now();
  await createSession("user-1", "user@example.com");
  const after = Date.now();

  const [, , options] = mockSet.mock.calls[0];
  const expires: Date = options.expires;
  const sevenDays = 7 * 24 * 60 * 60 * 1000;

  expect(expires.getTime()).toBeGreaterThanOrEqual(before + sevenDays - 1000);
  expect(expires.getTime()).toBeLessThanOrEqual(after + sevenDays + 1000);
});

test("createSession JWT contains correct userId and email", async () => {
  await createSession("user-1", "user@example.com");

  const [, token] = mockSet.mock.calls[0];
  const { payload } = await jwtVerify(token, JWT_SECRET);

  expect(payload.userId).toBe("user-1");
  expect(payload.email).toBe("user@example.com");
});

test("createSession JWT expires in ~7 days", async () => {
  const before = Math.floor(Date.now() / 1000);
  await createSession("user-1", "user@example.com");
  const after = Math.floor(Date.now() / 1000);

  const [, token] = mockSet.mock.calls[0];
  const { payload } = await jwtVerify(token, JWT_SECRET);

  const sevenDays = 7 * 24 * 60 * 60;
  expect(payload.exp).toBeGreaterThanOrEqual(before + sevenDays - 5);
  expect(payload.exp).toBeLessThanOrEqual(after + sevenDays + 5);
});

test("createSession is not secure in non-production", async () => {
  await createSession("user-1", "user@example.com");

  const [, , options] = mockSet.mock.calls[0];
  expect(options.secure).toBe(false);
});
