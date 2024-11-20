import { GraphQLTaggedNode, VariablesOf, OperationType, fetchQuery } from "relay-runtime";
import { getRelayEnvironment } from "./getRelayEnvironment";

export function readQuery<TQuery extends OperationType>(
    query: GraphQLTaggedNode,
    variables: VariablesOf<TQuery>
): Promise<TQuery["response"]> {
    return fetchQuery<TQuery>(getRelayEnvironment(), query, variables).toPromise();
}
