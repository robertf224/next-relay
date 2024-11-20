import { SubprocessTerminator, Executable } from "@rushstack/node-core-library";
import { Colorize } from "@rushstack/terminal";
import chokidar from "chokidar";
import child_process from "child_process";
import path from "path";
import { SingleProjectRelayConfig } from "./createRelayConfig";

export async function startRelayCompiler(opts: {
    folder: string;
    isDev: boolean;
    relayConfig: SingleProjectRelayConfig;
}): Promise<void> {
    const run = async () => {
        try {
            await runRelayCompiler(opts);
            console.log(" " + Colorize.green(Colorize.bold("✓")) + " Compiled Relay artifacts");
        } catch (error) {
            console.error(" " + Colorize.red(Colorize.bold("⨯")) + " Failed to compile Relay artifacts");
            if (opts.isDev) {
                console.error((error as Error).message);
            } else {
                throw error;
            }
        }
    };
    await run();
    if (opts.isDev) {
        chokidar
            .watch(opts.relayConfig.src ?? "", { ignored: opts.relayConfig.excludes, ignoreInitial: true })
            .on("all", run);
    }
}

async function runRelayCompiler(opts: { folder: string; isDev: boolean }): Promise<void> {
    const shellProcess: child_process.ChildProcess = child_process.spawn("relay-compiler", {
        cwd: opts.folder,
        stdio: ["ignore", "pipe", "pipe"],
        shell: true,
        env: {
            ...process.env,
            __DEV__: opts.isDev ? "true" : undefined,
            PATH: `${path.join(opts.folder, "node_modules", ".bin")}:${process.env.PATH}`,
        },
        ...SubprocessTerminator.RECOMMENDED_OPTIONS,
    });
    SubprocessTerminator.killProcessTreeOnExit(shellProcess, SubprocessTerminator.RECOMMENDED_OPTIONS);
    const result = await Executable.waitForExitAsync(shellProcess, { encoding: "utf8" });
    if (result.exitCode !== 0) {
        throw new Error(result.stderr);
    }
}
