import { FileSystem } from "@rushstack/node-core-library";
import path from "path";

export function isTypescriptProject(folder: string): boolean {
    return FileSystem.exists(path.join(folder, "tsconfig.json"));
}
