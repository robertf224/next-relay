"use client";

import createRelayEnvironment from "@bobbyfidz/next-relay/environment";
import React from "react";
import { RelayEnvironmentProvider } from "react-relay";

export const NextRelayEnvironmentProviderClient: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const environment = React.useMemo(() => createRelayEnvironment({ isServer: false }), []);
    return <RelayEnvironmentProvider environment={environment}>{children}</RelayEnvironmentProvider>;
};
