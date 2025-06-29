import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { parse, type TomlPrimitive } from "smol-toml";

const PACKAGES_DIR = join(__dirname, "..", "packages");
const DIR_CONTENT = readdirSync(PACKAGES_DIR);

DIR_CONTENT.forEach((filename) => {
	const testPath = join(PACKAGES_DIR, filename);
	const stat = statSync(testPath);
	if (stat.isDirectory()) {
		const dirContent = readdirSync(testPath);
		if (dirContent.includes("pyproject.toml")) {
			const toml = parse(
				readFileSync(join(testPath, "pyproject.toml"), { encoding: "utf8" }),
			);
			const project = toml.project as Record<string, TomlPrimitive>;
			const license = project.license as Record<string, TomlPrimitive> | string;
			const tool = toml.tool as Record<string, TomlPrimitive> | undefined;
			const json = {
				name: `@neurobot-1000/${project.name}`,
				private: true,
				version: project.version,
				description: project.description,
				homepage: "https://neurobot-1000.github.io",
				repository: {
					type: "git",
					url: "git+https://github.com/neurobot-1000/neurobot-1000.github.io.git",
				},
				author: project.authors[0],
				contributors: project.authors,
				license: typeof license === "string" ? license : "Unknown",
				config: tool ? (tool.neurobot ?? {}) : {},
			};
			writeFileSync(
				join(testPath, "package.json"),
				JSON.stringify(json, undefined, 2),
				{ encoding: "utf8" },
			);
		}
	}
});
