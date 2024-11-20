import { JsonSchema } from "@rushstack/node-core-library";
import relayCompilerConfigSchema from "./relay-compiler-config-schema.json";

export function loadSchema(): JsonSchema {
    return JsonSchema.fromLoadedObject(relayCompilerConfigSchema, {
        customFormats: {
            uint8: { type: "number", validate: (value) => value >= 0 && value <= 255 },
            uint: { type: "number", validate: (value) => value >= 0 && value <= Number.MAX_SAFE_INTEGER },
        },
    });
}
