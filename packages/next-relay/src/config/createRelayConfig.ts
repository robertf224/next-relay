import path from "path";
import { findSrcFolder } from "./next-config";
import { isTypescriptProject } from "./next-config/isTypescriptProject";
import { RelayConfig } from "./relay-config";

export type SingleProjectRelayConfig = Exclude<RelayConfig, { projects: unknown }> & { schema: string };

export function createRelayConfig(
    config: Partial<SingleProjectRelayConfig> & { schema: string }
): SingleProjectRelayConfig {
    const folder = process.cwd();
    const srcFolder = findSrcFolder(folder);
    return {
        language: isTypescriptProject(folder) ? "typescript" : "javascript",
        src: srcFolder,
        artifactDirectory: path.join(srcFolder, "__generated__/relay"),
        eagerEsModules: true,
        excludes: ["node_modules/**", "**/__generated__/**", ".next/**"],
        ...config,
    };
}
