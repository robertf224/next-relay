import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { graphql } from "relay-runtime";
import { NextRelayEnvironmentProvider } from "@bobbyfidz/next-relay";
import { readQuery } from "@bobbyfidz/next-relay/server";
import { layout_MetadataQuery } from "@/__generated__/relay/layout_MetadataQuery.graphql";

export async function generateMetadata(): Promise<Metadata> {
    const data = await readQuery<layout_MetadataQuery>(
        graphql`
            query layout_MetadataQuery {
                shop {
                    name
                    description
                }
            }
        `,
        {}
    );
    return {
        title: data.shop.name,
        description: data.shop.description,
    };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <NextRelayEnvironmentProvider>
            <html lang="en">
                <body className="bg-background text-foreground h-full w-full">{children}</body>
            </html>
        </NextRelayEnvironmentProvider>
    );
}
