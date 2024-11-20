import React from "react";
import { createOperationDescriptor, getRequest, GraphQLTaggedNode, OperationType } from "relay-runtime";
import { readQuery } from "../server";
import { NextRelaySegmentClient } from "./NextRelaySegmentClient";
import { getRelayEnvironment } from "../server/getRelayEnvironment";

export function NextRelaySegment<Query extends OperationType>(
    query: GraphQLTaggedNode,
    Component: React.FC<{ data: Query["response"]; children?: React.ReactNode }>,
    opts?: {
        variables?: (params: Record<string, string | undefined>) => Promise<Query["variables"]>;
    }
): React.FC<{ params: Promise<Query["variables"]>; children?: React.ReactNode }> {
    return async function NextRelaySegmentLoader({ params, children }) {
        const variables = opts?.variables ? await opts.variables(await params) : await params;
        const data = await readQuery(query, variables);

        const wrapped = <Component data={data} children={children} />;

        // TODO: derive this automatically via communicating with NextRelayEnvironmentProvider to save sending data over the wire when we don't need to
        const shouldUpdateClientStore = true;
        if (!shouldUpdateClientStore) {
            return wrapped;
        }

        const queryRequest = getRequest(query);
        const operationDescriptor = createOperationDescriptor(queryRequest, variables);
        // TODO: pare this down to only the slice of the store we need to satisfy the query
        const records = getRelayEnvironment().getStore().getSource().toJSON();
        return (
            <NextRelaySegmentClient records={records} operationDescriptor={operationDescriptor}>
                {wrapped}
            </NextRelaySegmentClient>
        );
    };
}
