import { Command } from "@oclif/core";

export default class Init extends Command {
    public static override description = "initialize next-relay from an existing Next.js project";

    public async run(): Promise<void> {
        // Ask for schema file path or URL with introspection enabled
        // Ask for URL + token?
        // Create relay.config.js
        // Create relay/createRelayEnvironment.ts file
        // Update gitignore file
        // Update next config
        // Update root layout
        this.log("TODO");
    }
}
