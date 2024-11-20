import { page_ProductPageQuery } from "@/__generated__/relay/page_ProductPageQuery.graphql";
import { AddToCartButton } from "@/components/AddToCartButton";
import { NextRelaySegment } from "@bobbyfidz/next-relay";
import Image from "next/image";
import { graphql } from "relay-runtime";

export default NextRelaySegment<page_ProductPageQuery>(
    graphql`
        query page_ProductPageQuery($slug: String!) {
            product(handle: $slug) @required(action: THROW) {
                id
                title
                featuredImage @required(action: THROW) {
                    url
                    altText
                    width @required(action: THROW)
                    height @required(action: THROW)
                }
                variants(first: 1) {
                    nodes {
                        id
                    }
                }
                priceRange {
                    minVariantPrice {
                        amount
                        currencyCode
                    }
                }
            }
        }
    `,
    function ProductPage({ data }) {
        const { product } = data;
        return (
            <div className="items flex max-w-screen-xl gap-10 p-20">
                <Image
                    className="w-96"
                    src={product.featuredImage.url}
                    alt={product.featuredImage.altText ?? "Product image"}
                    width={product.featuredImage.width}
                    height={product.featuredImage.height}
                />
                <div className="flex flex-1 flex-col">
                    <h2 className="text-xl">{product.title}</h2>
                    <span className="italic">
                        {product.priceRange.minVariantPrice.amount}{" "}
                        {product.priceRange.minVariantPrice.currencyCode}
                    </span>
                    <AddToCartButton productId={product.variants.nodes[0].id} />
                </div>
            </div>
        );
    }
);
