export * from "./withNextRelay";
export * from "./createRelayConfig";
export * from "./getRelayConfig";
export * from "./getCreateRelayEnvironmentPath";
// TODO: turn this into just a re-export from `relay-config` once this PR merges: https://github.com/facebook/relay/pull/4780
export type { RelayConfig } from "./relay-config";
