import fs from "fs";
import path from "path";

import defaultConfig from "../default-config.js";

export default function arcordConfig() {
    const arcordConfigPath = path.join(process.cwd(), "arcord.config.json");
    if (!fs.existsSync(arcordConfigPath)) {
        console.log("arcord.json not found, creating...");
        fs.writeFileSync(
            arcordConfigPath,
            JSON.stringify(
                defaultConfig,
                null,
                2
            )
        );
    }

    const arcordConfig = JSON.parse(fs.readFileSync(arcordConfigPath, "utf8"));

    return arcordConfig;
}
