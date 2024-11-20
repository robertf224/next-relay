import { Environment, Network, RecordSource, Store, FetchFunction } from "relay-runtime";
import type { CreateRelayEnvironment } from "@bobbyfidz/next-relay/environment";

const createRelayEnvironment: CreateRelayEnvironment = ({ isServer }) => {
    const networkFetch: FetchFunction = async (request, variables) => {
        const response = await fetch(process.env.NEXT_PUBLIC_SHOPIFY_API_URL!, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Storefront-Access-Token": process.env.NEXT_PUBLIC_SHOPIFY_TOKEN!,
            },
            body: JSON.stringify({
                query: request.text,
                variables,
            }),
        });
        return await response.json();
    };
    return new Environment({
        network: Network.create(networkFetch),
        store: new Store(new RecordSource()),
        isServer,
    });
};

export default createRelayEnvironment;
