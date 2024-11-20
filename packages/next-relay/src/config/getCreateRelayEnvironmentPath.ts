import path from "path";
import { findSrcFolder, isTypescriptProject } from "./next-config";

export function getCreateRelayEnvironmentPath(folder: string): string {
    const extension = isTypescriptProject(folder) ? "ts" : "js";
    const srcFolder = findSrcFolder(folder);
    return path.join(srcFolder, "relay", `createRelayEnvironment.${extension}`);
}
