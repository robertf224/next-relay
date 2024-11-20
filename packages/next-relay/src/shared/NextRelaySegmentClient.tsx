"use client";

import React from "react";
import { useRelayEnvironment } from "react-relay";
import { OperationDescriptor, RecordSource } from "relay-runtime";
import { RecordMap } from "relay-runtime/lib/store/RelayStoreTypes";

const committedQueryIds = new Set<string>();
export interface NextRelaySegmentClientProps {
    operationDescriptor: OperationDescriptor;
    records: RecordMap;
    children: React.ReactNode;
}

export const NextRelaySegmentClient: React.FC<NextRelaySegmentClientProps> = ({
    operationDescriptor,
    records,
    children,
}) => {
    const environment = useRelayEnvironment();
    // TODO: can we get rid of these is readies?
    const [ready, setIsReady] = React.useState(false);
    React.useLayoutEffect(() => {
        if (!committedQueryIds.has(operationDescriptor.request.identifier)) {
            environment.getStore().publish(RecordSource.create(records));
            environment.getStore().notify(operationDescriptor);
            committedQueryIds.add(operationDescriptor.request.identifier);
        }
        setIsReady(true);
    }, [environment, operationDescriptor, records]);
    return ready ? children : null;
};
