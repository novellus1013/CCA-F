import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallBadge } from "../ToolCallBadge";
import type { ToolInvocation } from "ai";

afterEach(() => {
  cleanup();
});

// str_replace_editor labels

test("ToolCallBadge shows 'Creating' for str_replace_editor create command", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/App.jsx" },
    state: "result",
    result: "Success",
  };
  render(<ToolCallBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Creating /App.jsx")).toBeDefined();
});

test("ToolCallBadge shows 'Editing' for str_replace_editor str_replace command", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "2",
    toolName: "str_replace_editor",
    args: { command: "str_replace", path: "/Card.jsx" },
    state: "result",
    result: "Success",
  };
  render(<ToolCallBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Editing /Card.jsx")).toBeDefined();
});

test("ToolCallBadge shows 'Editing' for str_replace_editor insert command", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "3",
    toolName: "str_replace_editor",
    args: { command: "insert", path: "/Card.jsx" },
    state: "result",
    result: "Success",
  };
  render(<ToolCallBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Editing /Card.jsx")).toBeDefined();
});

test("ToolCallBadge shows 'Viewing' for str_replace_editor view command", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "4",
    toolName: "str_replace_editor",
    args: { command: "view", path: "/App.jsx" },
    state: "result",
    result: "Success",
  };
  render(<ToolCallBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Viewing /App.jsx")).toBeDefined();
});

// file_manager labels

test("ToolCallBadge shows 'Renaming' for file_manager rename command", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "5",
    toolName: "file_manager",
    args: { command: "rename", path: "/old.jsx", new_path: "/new.jsx" },
    state: "result",
    result: "Success",
  };
  render(<ToolCallBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Renaming /old.jsx → /new.jsx")).toBeDefined();
});

test("ToolCallBadge shows 'Deleting' for file_manager delete command", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "6",
    toolName: "file_manager",
    args: { command: "delete", path: "/old.jsx" },
    state: "result",
    result: "Success",
  };
  render(<ToolCallBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Deleting /old.jsx")).toBeDefined();
});

// Unknown tool fallback

test("ToolCallBadge falls back to tool name for unknown tools", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "7",
    toolName: "unknown_tool",
    args: {},
    state: "result",
    result: "Success",
  };
  render(<ToolCallBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("unknown_tool")).toBeDefined();
});

// Indicator states

test("ToolCallBadge shows green dot when state is result", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "8",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/App.jsx" },
    state: "result",
    result: "Success",
  };
  const { container } = render(<ToolCallBadge toolInvocation={toolInvocation} />);
  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

test("ToolCallBadge shows spinner when state is call", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "9",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/App.jsx" },
    state: "call",
  };
  const { container } = render(<ToolCallBadge toolInvocation={toolInvocation} />);
  expect(container.querySelector(".animate-spin")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});
