import { page_CartPageQuery } from "@/__generated__/relay/page_CartPageQuery.graphql";
import { NextRelaySegment } from "@bobbyfidz/next-relay";
import { cookies } from "next/headers";
import Image from "next/image";
import { graphql } from "relay-runtime";

export default NextRelaySegment<page_CartPageQuery>(
    graphql`
        query page_CartPageQuery($cartId: ID!) {
            cart(id: $cartId) {
                lines(first: 10) {
                    nodes {
                        id
                        merchandise {
                            ... on ProductVariant {
                                product {
                                    title
                                }
                                image @required(action: THROW) {
                                    url
                                    altText
                                    width @required(action: THROW)
                                    height @required(action: THROW)
                                }
                            }
                        }
                        quantity
                    }
                }
            }
        }
    `,
    function CartPage({ data }) {
        return (
            <div className="flex flex-col gap-5 p-10">
                <h2>Cart</h2>
                <div className="flex flex-col gap-2">
                    {data.cart?.lines.nodes.map((line) => (
                        <div key={line.id} className="flex items-start gap-2">
                            <Image
                                className="w-10"
                                src={line.merchandise.image?.url}
                                alt={line.merchandise.image?.altText ?? "Product image"}
                                width={line.merchandise.image?.width}
                                height={line.merchandise.image?.height}
                            />
                            <div className="flex items-center gap-1">
                                <h6>{line.merchandise.product?.title}</h6>
                                <span>•</span>
                                <span>{line.quantity}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    },
    {
        variables: async () => {
            const cartId = (await cookies()).get("cartId")?.value;
            if (!cartId) {
                throw new Error("No cart found");
            }
            return { cartId };
        },
    }
);
