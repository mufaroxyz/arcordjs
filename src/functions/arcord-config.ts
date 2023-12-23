import path from "path";
import fs from "fs";

export default function arcordConfig() {
  const arcordConfigPath = path.join(process.cwd(), "arcord.json");
  if (!fs.existsSync(arcordConfigPath)) {
    console.log("arcord.json not found, creating...");
    fs.writeFileSync(
      arcordConfigPath,
      JSON.stringify(
        {
          token: "",
        },
        null,
        2
      )
    );
  }

  const arcordConfig = JSON.parse(fs.readFileSync(arcordConfigPath, "utf8"));

  return arcordConfig;
}
