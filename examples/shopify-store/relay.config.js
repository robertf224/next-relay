// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createRelayConfig } = require("@bobbyfidz/next-relay/config");

module.exports = createRelayConfig({
    schema: "schema.graphql",
});
