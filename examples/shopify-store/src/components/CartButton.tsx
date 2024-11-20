import { CartButtonFragment$key } from "@/__generated__/relay/CartButtonFragment.graphql";
import { readFragment } from "@bobbyfidz/next-relay/server";
import Link from "next/link";
import React from "react";
import { graphql } from "relay-runtime";

const CartButtonFragment = graphql`
    fragment CartButtonFragment on Cart {
        id
        totalQuantity
    }
`;

export interface CartButtonProps {
    fragment: CartButtonFragment$key;
}

export const CartButton: React.FC<CartButtonProps> = async ({ fragment }) => {
    const data = await readFragment(CartButtonFragment, fragment);
    return (
        <Link
            className="bg-background border-foreground flex items-center gap-1 rounded border px-2 py-1 font-bold hover:opacity-50"
            href="/cart"
        >
            <span>Cart</span>
            <span>({data.totalQuantity})</span>
        </Link>
    );
};
