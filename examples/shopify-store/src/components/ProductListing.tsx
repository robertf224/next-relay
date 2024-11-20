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
