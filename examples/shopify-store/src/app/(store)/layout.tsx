import { layout_StoreLayoutQuery } from "@/__generated__/relay/layout_StoreLayoutQuery.graphql";
import { CartButton } from "@/components/CartButton";
import { NextRelaySegment } from "@bobbyfidz/next-relay";
import { cookies } from "next/headers";
import Link from "next/link";
import { graphql } from "relay-runtime";

export default NextRelaySegment<layout_StoreLayoutQuery, { children: React.ReactNode }>(
    graphql`
        query layout_StoreLayoutQuery($cartId: ID!) {
            shop {
                name
            }
            cart(id: $cartId) {
                ...CartButtonFragment
            }
        }
    `,
    function StoreLayout({ data, children }) {
        return (
            <div className="flex flex-col">
                <nav className="flex h-12 items-center justify-between gap-2 border-b px-5 py-2">
                    <Link href="/">
                        <h1 className="text-xl">{data.shop.name}</h1>
                    </Link>
                    {data.cart && <CartButton fragment={data.cart} />}
                </nav>
                <main className="flex-1">{children}</main>
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
