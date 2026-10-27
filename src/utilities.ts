import { commands, Uri, workspace, type WorkspaceFolder } from "vscode";
import path from "node:path";
import { EXTENSION_ID } from "./constants.ts";

export function getConfigUri(ws: WorkspaceFolder) {
  return Uri.joinPath(ws.uri, ".devcontainer", "devcontainer.json");
}

export function getHomeDir(): string {
  return process.env["HOME"] ?? process.env["USERPROFILE"] ?? "";
}

export function getWorkspaceFolder(): WorkspaceFolder | undefined {
  return workspace.workspaceFolders?.[0];
}

export async function hasDevcontainerConfig(ws: WorkspaceFolder | undefined) {
  if (!ws) {
    return false;
  }
  try {
    // Resolve the config via the VS Code filesystem API rather than Node's fs: When we're "running" in the dev container, the extension is still on the host and fs.existsSync would run on the local machine.
    await workspace.fs.stat(getConfigUri(ws));
    return true;
  } catch {
    return false;
  }
}

function makeWorkspaceSlug(wsFsPath: string): string {
  const name = path.basename(wsFsPath).toLowerCase();
  let slug = name.replaceAll(/[^a-z0-9._-]+/gu, "-");
  slug = slug.replaceAll(/^[._-]+|[._-]+$/gu, "");
  return slug || "workspace";
}

export function getHostAlias(wsFsPath: string): string {
  const slug = makeWorkspaceSlug(wsFsPath);
  return `${EXTENSION_ID}-${slug}`;
}

export async function updateDevcontainerContext() {
  await commands.executeCommand(
    "setContext",
    `${EXTENSION_ID}.hasConfig`,
    await hasDevcontainerConfig(getWorkspaceFolder()),
  );
}
