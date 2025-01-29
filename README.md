# next-relay

An integration layer between Next.js and Relay.

## Installation

Create a Relay config at `relay.config.js`. The `createRelayConfig` utility function isn't necessary but it sets up sane defaults and provides strong typing for additional config.

```javascript
const { createRelayConfig } = require("@bobbyfidz/next-relay/config");

module.exports = createRelayConfig({
    schema: "schema.graphql",
});
```

Add the plugin to your Next config. There is no need to duplicate Relay config like `src`, it's automatically copied from your `relay.config.js`.

```javascript
import { withNextRelay } from "@bobbyfidz/next-relay/config";

const nextConfig = {
    // ...
};

export default withNextRelay(nextConfig);
```

The plugin can also opt into running the Relay compiler automatically when you run `next dev` and `next build` by passing `{ runCompiler: true }` as the second argument.

Add a function to create your Relay environment at `src/createRelayEnvironment.ts` (or just `createRelayEnvironment.ts` if you're not using the `src` folder).

```typescript
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
```

Wrap layouts that should have access to the Relay environment with `NextRelayEnvironmentProvider`.

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <NextRelayEnvironmentProvider>
            <html lang="en">
                <body>{children}</body>
            </html>
        </NextRelayEnvironmentProvider>
    );
}
```

## Usage

Use `NextRelaySegment` to load queries for routes that are server components. Route params will automatically be injected into the query as variables.

```tsx
import { page_HomePageQuery } from "@/__generated__/relay/page_HomePageQuery.graphql";
import { ProductListing } from "@/components/ProductListing";
import { NextRelaySegment } from "@bobbyfidz/next-relay";
import { graphql } from "relay-runtime";

export default NextRelaySegment<page_HomePageQuery>(
    graphql`
        query page_HomePageQuery {
            products(first: 20) {
                edges {
                    node {
                        id
                        ...ProductListingFragment
                    }
                }
            }
        }
    `,
    function HomePage({ data }) {
        return (
            <div className="grid grid-cols-1 place-items-center gap-5 p-10 sm:grid-cols-4">
                {data.products.edges.map((edge) => (
                    <ProductListing key={edge.node.id} fragment={edge.node} />
                ))}
            </div>
        );
    }
);
```

You can compose server and client components that have fragments. Use the normal Relay hooks for client components (e.g. `useFragment`, `usePaginationFragment`) and use `readFragment` in server components.

```tsx
import { ProductListingFragment$key } from "@/__generated__/relay/ProductListingFragment.graphql";
import { readFragment } from "@bobbyfidz/next-relay/server";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { graphql } from "relay-runtime";

const ProductListingFragment = graphql`
    fragment ProductListingFragment on Product {
        id
        title
        handle
        featuredImage @required(action: THROW) {
            url
            altText
            width @required(action: THROW)
            height @required(action: THROW)
        }
        priceRange {
            minVariantPrice {
                amount
                currencyCode
            }
        }
    }
`;

export interface ProductListingProps {
    fragment: ProductListingFragment$key;
}

export const ProductListing: React.FC<ProductListingProps> = async ({ fragment }) => {
    const data = await readFragment(ProductListingFragment, fragment);
    return (
        <Link href={`/products/${data.handle}`}>
            <div className="flex flex-col gap-1">
                <Image
                    className="w-96"
                    src={data.featuredImage.url}
                    alt={data.featuredImage.altText ?? "Product image"}
                    width={data.featuredImage.width}
                    height={data.featuredImage.height}
                />
                <h6 className="text-lg">{data.title}</h6>
                <span className="italic">
                    {data.priceRange.minVariantPrice.amount} {data.priceRange.minVariantPrice.currencyCode}
                </span>
            </div>
        </Link>
    );
};
```

## CLI

There is only one cli command right now which automatically pulls a remote schema into your repo. You can run `next-relay pull-schema` which (1) looks at your Relay config to figure out where
the schema file is supposed to go (2) loads environment variables [the same way Next does](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables#environment-variable-load-order) (3) creates a Relay environment using `src/createRelayEnvironment.ts` (4) runs an introspection query to get the schema (5) writes the schema to the schema file.
