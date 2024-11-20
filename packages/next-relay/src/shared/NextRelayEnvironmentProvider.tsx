import React from "react";
import { NextRelayEnvironmentProviderClient } from "./NextRelayEnvironmentProviderClient";

export const NextRelayEnvironmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // TODO: set flag that we should serialize data to the client since we're implying it by rendering this component
    return <NextRelayEnvironmentProviderClient>{children}</NextRelayEnvironmentProviderClient>;
};
