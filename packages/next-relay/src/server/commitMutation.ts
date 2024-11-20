import { commitMutation as baseCommitMutation, GraphQLTaggedNode, MutationParameters } from "relay-runtime";
import { getRelayEnvironment } from "./getRelayEnvironment";

export function commitMutation<TOperation extends MutationParameters>(
    mutation: GraphQLTaggedNode,
    variables: TOperation["variables"]
): Promise<TOperation["response"]> {
    return new Promise((resolve, reject) => {
        baseCommitMutation(getRelayEnvironment(), {
            mutation,
            variables,
            onCompleted: resolve,
            onError: reject,
        });
    });
}
