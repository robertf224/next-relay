import { FileSystem } from "@rushstack/node-core-library";
import path from "path";

export function findSrcFolder(folder: string): string {
    const withSrc = path.join(folder, "src");
    return FileSystem.exists(withSrc) ? withSrc : folder;
}
