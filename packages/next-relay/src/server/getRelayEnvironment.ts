import React from "react";
import createRelayEnvironment from "@bobbyfidz/next-relay/environment";

export const getRelayEnvironment = React.cache(() => createRelayEnvironment({ isServer: true }));
