import { withNextRelay } from "@bobbyfidz/next-relay/config";

const nextConfig = withNextRelay({
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.shopify.com",
            },
        ],
    },
    experimental: {
        typedRoutes: true,
    },
});

export default nextConfig;
