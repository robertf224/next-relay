import { cosmiconfigSync, defaultLoadersSync } from "cosmiconfig";
import type { ConfigFile as RelayConfig } from "./RelayConfig";
import { loadSchema } from "./loadSchema";

export function loadConfig(folder: string): { config: RelayConfig; path: string } | undefined {
    const schema = loadSchema();

    const result = cosmiconfigSync("relay", {
        searchPlaces: ["relay.config.js", "relay.config.json", "package.json"],
        loaders: defaultLoadersSync,
    }).search(folder);
    if (!result) {
        return undefined;
    }
    const { config, filepath } = result;

    schema.validateObject(config, filepath);
    return { config, path: filepath };
}
