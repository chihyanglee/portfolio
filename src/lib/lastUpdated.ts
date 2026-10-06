import { execFileSync } from "node:child_process";
import type { Lang } from "../i18n";

// Date of the last commit that touched site content, not the build time: deploys that
// only bump dependencies or change code must not claim the content is fresh.
// Needs full git history — CI checks out with fetch-depth: 0. In a shallow clone whose
// tip commit isn't a content commit, git returns nothing and the build fails here.
const iso = execFileSync("git", ["log", "-1", "--format=%cI", "--", "src/data", "src/content", "src/i18n"], {
  encoding: "utf8",
}).trim();
if (!iso) throw new Error("lastUpdated: no content commit found — is the git checkout shallow?");
const date = new Date(iso);

export function lastUpdated(lang: Lang): string {
  return date.toLocaleDateString(lang, {
    year: "numeric",
    month: lang === "en" ? "short" : "long",
    timeZone: "Asia/Taipei",
  });
}
