import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const readJson = (relativePath: string) => {
  const filePath = resolve(process.cwd(), relativePath);
  return JSON.parse(readFileSync(filePath, "utf-8")) as Record<string, string>;
};

const en = readJson("client/i18n/locales/en.json");
const ru = readJson("client/i18n/locales/ru.json");

const enKeys = new Set(Object.keys(en));
const ruKeys = new Set(Object.keys(ru));

const missingInRu = [...enKeys].filter((key) => !ruKeys.has(key));
const missingInEn = [...ruKeys].filter((key) => !enKeys.has(key));

if (missingInRu.length || missingInEn.length) {
  console.error("i18n key mismatch detected.");
  if (missingInRu.length) {
    console.error("Missing in ru.json:");
    missingInRu.forEach((key) => console.error(`  - ${key}`));
  }
  if (missingInEn.length) {
    console.error("Missing in en.json:");
    missingInEn.forEach((key) => console.error(`  - ${key}`));
  }
  process.exit(1);
}

console.log(`i18n parity check passed. ${enKeys.size} keys matched.`);
