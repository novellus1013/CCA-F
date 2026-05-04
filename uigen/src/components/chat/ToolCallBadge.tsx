"use client";

import { Loader2 } from "lucide-react";
import type { ToolInvocation } from "ai";

function getLabel(toolInvocation: ToolInvocation): string {
  const { toolName, args } = toolInvocation;

  if (toolName === "str_replace_editor") {
    const { command, path } = args as { command?: string; path?: string };
    if (!path) return toolName;
    if (command === "create") return `Creating ${path}`;
    if (command === "view") return `Viewing ${path}`;
    return `Editing ${path}`;
  }

  if (toolName === "file_manager") {
    const { command, path, new_path } = args as {
      command?: string;
      path?: string;
      new_path?: string;
    };
    if (!path) return toolName;
    if (command === "rename") return `Renaming ${path} → ${new_path ?? ""}`;
    if (command === "delete") return `Deleting ${path}`;
    return path;
  }

  return toolName;
}

interface ToolCallBadgeProps {
  toolInvocation: ToolInvocation;
}

export function ToolCallBadge({ toolInvocation }: ToolCallBadgeProps) {
  const isDone = toolInvocation.state === "result";
  const label = getLabel(toolInvocation);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isDone ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
