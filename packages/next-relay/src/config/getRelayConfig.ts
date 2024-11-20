import { SingleProjectRelayConfig } from "./createRelayConfig";
import { loadConfig } from "./relay-config";

export async function getRelayConfig(
    folder: string
): Promise<{ config: SingleProjectRelayConfig; path: string }> {
    const relayConfig = loadConfig(folder);
    if (relayConfig === undefined) {
        throw new Error("No Relay configuration found.");
    }
    const { config, path } = relayConfig;
    if ("projects" in config) {
        throw new Error("Multi-project Relay configurations aren't supported with next-relay.");
    }
    return { config: config as SingleProjectRelayConfig, path };
}
