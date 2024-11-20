import type { NextConfig as StaticNextConfig } from "next";
import { merge } from "ts-deepmerge";
import path from "path";
import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } from "next/constants";
import { getCreateRelayEnvironmentPath } from "./getCreateRelayEnvironmentPath";
import { getRelayConfig } from "./getRelayConfig";
import { startRelayCompiler } from "./startRelayCompiler";

export interface NextRelayConfig {
    /** @default false */
    runCompiler?: boolean;
}

export function withNextRelay(nextConfig: NextConfig, nextRelayConfig?: NextRelayConfig): NextConfig {
    const folder = process.cwd();
    let isCompilerStarted = false;

    return async (phase: string, opts: unknown) => {
        const staticNextConfig = await resolveConfig(phase, opts, nextConfig);

        const { config: relayConfig } = await getRelayConfig(folder);
        const { language, src, artifactDirectory, eagerEsModules } = relayConfig;
        const createRelayEnvironmentPath = getCreateRelayEnvironmentPath(folder);

        const editedNextConfig = merge(staticNextConfig, {
            // Automatically copy Relay compiler configuration so we don't need to duplicate.
            compiler: {
                relay: {
                    language,
                    src: src ?? "",
                    artifactDirectory: artifactDirectory ?? undefined,
                    eagerEsModules,
                },
            },
            // Set up Relay environment resolution.
            webpack: (webpackConfig, webpackOptions) => {
                const staticWebpackConfig = staticNextConfig.webpack
                    ? staticNextConfig.webpack(webpackConfig, webpackOptions)
                    : webpackConfig;
                return merge(staticWebpackConfig, {
                    resolve: {
                        alias: {
                            "@bobbyfidz/next-relay/environment": path.resolve(
                                webpackOptions.dir,
                                createRelayEnvironmentPath
                            ),
                        },
                    },
                });
            },
            experimental: {
                turbo: {
                    resolveAlias: {
                        "@bobbyfidz/next-relay/environment": createRelayEnvironmentPath,
                    },
                },
            },
        } satisfies Partial<StaticNextConfig>);

        if (
            nextRelayConfig?.runCompiler &&
            !isCompilerStarted &&
            (phase === PHASE_PRODUCTION_BUILD || phase === PHASE_DEVELOPMENT_SERVER) &&
            shouldSetupContinue()
        ) {
            isCompilerStarted = true;
            await startRelayCompiler({ folder, isDev: phase === PHASE_DEVELOPMENT_SERVER, relayConfig });
        }

        return editedNextConfig;
    };
}

// TODO: get the equivalent of this exported from Next.js directly
// https://github.com/vercel/next.js/blob/ec46f90739ffbba75e1f9719383e2ad9d85fc12a/packages/next/src/server/config-shared.ts#L1087-L1093
type NextConfigFunction = (phase: string, opts: unknown) => StaticNextConfig | Promise<StaticNextConfig>;
type NextConfig = StaticNextConfig | NextConfigFunction;
async function resolveConfig(phase: string, opts: unknown, config: NextConfig): Promise<StaticNextConfig> {
    const resolvedConfig = typeof config === "function" ? config(phase, opts) : config;
    return await resolvedConfig;
}

// TODO: get the equivalent of this in Next.js, copied from https://github.com/cloudflare/next-on-pages/blob/main/internal-packages/next-dev/src/shared.ts
function shouldSetupContinue(): boolean {
    const AsyncLocalStorage = (globalThis as unknown as { AsyncLocalStorage?: unknown })["AsyncLocalStorage"];
    return !!AsyncLocalStorage;
}
