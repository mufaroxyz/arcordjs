import { readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const templatesDir = join(__dirname, "..", "projectTemplates")

const templates = Object.freeze(readdirSync(templatesDir))

export { templates, templatesDir }