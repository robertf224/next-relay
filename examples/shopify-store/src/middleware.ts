import { commitMutation } from "@bobbyfidz/next-relay/server";
import { NextResponse, NextRequest } from "next/server";
import { graphql } from "relay-runtime";
import { middleware_createCartMutation } from "./__generated__/relay/middleware_createCartMutation.graphql";

export async function middleware(request: NextRequest) {
    const existingCartId = request.cookies.get("cartId")?.value;
    let cartId = existingCartId;
    if (!cartId) {
        const result = await commitMutation<middleware_createCartMutation>(
            graphql`
                mutation middleware_createCartMutation {
                    cartCreate {
                        cart {
                            id
                        }
                    }
                }
            `,
            {}
        );
        cartId = result.cartCreate?.cart?.id;
    }

    const response = NextResponse.next();

    if (!existingCartId && cartId) {
        response.cookies.set("cartId", cartId);
    }

    return response;
}
