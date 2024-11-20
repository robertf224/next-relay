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
