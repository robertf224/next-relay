"use client";

import { AddToCartButtonMutation as TAddToCartButtonMutation } from "@/__generated__/relay/AddToCartButtonMutation.graphql";
import { getCookie } from "cookies-next/client";
import React from "react";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";

const AddToCartButtonMutation = graphql`
    mutation AddToCartButtonMutation($cartId: ID!, $productId: ID!) {
        cartLinesAdd(cartId: $cartId, lines: [{ merchandiseId: $productId, quantity: 1 }]) {
            cart {
                totalQuantity
            }
        }
    }
`;

export interface AddToCartButtonProps {
    productId: string;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ productId }) => {
    const [addToCart, isPending] = useMutation<TAddToCartButtonMutation>(AddToCartButtonMutation);
    const handleClick = () => {
        const cartId = getCookie("cartId");
        if (!cartId) {
            throw new Error("No cart found");
        }
        addToCart({
            variables: {
                cartId,
                productId,
            },
            optimisticUpdater: (store) => {
                const cart = store.get(cartId)!;
                cart.setValue((cart.getValue("totalQuantity") as number) + 1, "totalQuantity");
            },
        });
    };

    return (
        <button
            type="button"
            className="w-32 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            onClick={handleClick}
            disabled={isPending}
        >
            Add to cart
        </button>
    );
};
