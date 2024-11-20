import type { Environment } from "relay-runtime";

export type CreateRelayEnvironment = (opts: { isServer: boolean }) => Environment;

const createRelayEnvironment: CreateRelayEnvironment = () => {
    throw new Error("Couldn't find `createRelayEnvironment`.");
};

export default createRelayEnvironment;
