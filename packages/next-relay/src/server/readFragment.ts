import {
    Environment,
    GraphQLTaggedNode,
    getFragment,
    getSingularSelector,
    getPluralSelector,
    getPendingOperationsForFragment,
    SingularReaderSelector,
    ReaderFragment,
    SelectorData,
} from "relay-runtime";
import type { KeyType, KeyTypeData, ArrayKeyType, ArrayKeyTypeData } from "react-relay/relay-hooks/helpers";
import { getRelayEnvironment } from "./getRelayEnvironment";

// TODO: see if we can clean out some of these types by wrapping `useFragment`

export function readFragment<TKey extends KeyType>(
    fragmentInput: GraphQLTaggedNode,
    fragmentRef: TKey
): Promise<KeyTypeData<TKey>>;

export function readFragment<TKey extends KeyType>(
    fragmentInput: GraphQLTaggedNode,
    fragmentRef: TKey | null | undefined
): Promise<KeyTypeData<TKey> | null | undefined>;

export function readFragment<TKey extends ArrayKeyType>(
    fragmentInput: GraphQLTaggedNode,
    fragmentRef: TKey
): Promise<ArrayKeyTypeData<TKey>>;

export function readFragment<TKey extends ArrayKeyType>(
    fragmentInput: GraphQLTaggedNode,
    fragmentRef: TKey | null | undefined
): Promise<ArrayKeyTypeData<TKey> | null | undefined>;

export function readFragment(fragment: GraphQLTaggedNode, fragmentRef: unknown) {
    const environment = getRelayEnvironment();
    const readerFragment = getFragment(fragment);
    if (fragmentRef == null) {
        return fragmentRef;
    }

    if (Array.isArray(fragmentRef)) {
        const pluralSelector = getPluralSelector(readerFragment, fragmentRef);
        return Promise.all(
            pluralSelector.selectors.map((selector) => getSelectorData(selector, readerFragment, environment))
        );
    } else {
        const selector = getSingularSelector(readerFragment, fragmentRef);
        return getSelectorData(selector, readerFragment, environment);
    }
}

async function getSelectorData(
    selector: SingularReaderSelector,
    readerFragment: ReaderFragment,
    environment: Environment
): Promise<SelectorData> {
    const pending = getPendingOperationsForFragment(environment, readerFragment, selector.owner);
    const { isMissingData } = environment.lookup(selector);
    if (isMissingData) {
        if (!pending) {
            throw new Error(
                "No pending query for fragment, make sure your route segment is wrapped with NextRelaySegment and that you have spread in this fragment"
            );
        }
        await pending.promise;
    }

    const { isMissingData: isStillMissingData, data } = environment.lookup(selector);
    if (isStillMissingData) {
        throw new Error("Unexpected error");
    }
    return data;
}
