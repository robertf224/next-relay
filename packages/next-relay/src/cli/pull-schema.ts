import { Command } from "@oclif/core";
import { loadEnvConfig } from "@next/env";
import createJiti from "jiti";
import { buildClientSchema, printSchema, getIntrospectionQuery, IntrospectionQuery } from "graphql";
import { GraphQLSingularResponse } from "relay-runtime";
import { FileSystem } from "@rushstack/node-core-library";
import { intro, spinner, log, outro } from "@clack/prompts";
import crypto from "crypto";
import path from "path";
import { getCreateRelayEnvironmentPath, getRelayConfig } from "../config";
import { CreateRelayEnvironment } from "../environment";

export default class PullSchema extends Command {
    static override description = "pull the latest schema with an introspection query";

    public async run(): Promise<void> {
        const folder = process.cwd();

        intro("next-relay pull-schema");

        const { config: relayConfig, path: relayConfigPath } = await getRelayConfig(folder);
        log.step(`Loaded Relay config from ${path.relative(folder, relayConfigPath)}`);
        if (!isWithin(folder, relayConfig.schema)) {
            log.warn(
                "The schema file is outside the project folder so we assume it's a locally generated schema we shouldn't be overwriting"
            );
            return;
        }

        const { loadedEnvFiles } = loadEnvConfig(folder, true, log);
        log.step(`Loaded environment variables from ${loadedEnvFiles.map((f) => f.path).join(", ")}`);

        const createRelayEnvironmentPath = getCreateRelayEnvironmentPath(folder);
        const jiti = createJiti(__filename);
        const createRelayEnvironment: CreateRelayEnvironment = (await jiti(createRelayEnvironmentPath))
            .default;
        const relayEnvironment = createRelayEnvironment({ isServer: true });
        log.step(`Created Relay environment from ${path.relative(folder, createRelayEnvironmentPath)}`);

        const introspectionQuery = getIntrospectionQuery();
        const introspectionSpinner = spinner();
        introspectionSpinner.start("Pulling schema with introspection query");
        const schemaResponse = await relayEnvironment
            .getNetwork()
            .execute(
                {
                    text: introspectionQuery,
                    // https://github.com/facebook/relay/blob/0cf0948a65b8cb541d8350dc71ad7499330f802d/compiler/crates/relay-codegen/src/build_ast.rs#L2434
                    cacheID: crypto.createHash("md5").update(introspectionQuery).digest("hex"),
                    id: null,
                    metadata: {},
                    name: "IntrospectionQuery",
                    operationKind: "query",
                },
                {},
                {}
            )
            .toPromise();
        introspectionSpinner.stop("Pulled schema with introspection query");
        const schema = buildClientSchema(
            (schemaResponse as GraphQLSingularResponse).data as IntrospectionQuery
        );
        const schemaContent = printSchema(schema);
        await FileSystem.writeFileAsync(path.join(folder, relayConfig.schema), schemaContent);

        outro(`Wrote schema to ${relayConfig.schema}`);
    }
}

function isWithin(folder: string, other: string): boolean {
    const relativePath = path.relative(folder, other);
    return !relativePath.startsWith("..") && !path.isAbsolute(relativePath);
}
