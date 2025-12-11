import assert from "node:assert";
import { parseLlmsListing } from "../utils/cossUi.js";

const listing = `
# coss ui

- [Introduction](https://coss.com/ui/docs/index.md)
- [Get Started](https://coss.com/ui/docs/get-started.md)
- [Accordion](https://coss.com/ui/docs/components/accordion.md)
- [Alert](https://coss.com/ui/docs/components/alert.md)
`;

const entries = parseLlmsListing(listing);
assert.strictEqual(entries.length, 4);
assert.deepStrictEqual(entries[0], {
  title: "Introduction",
  href: "https://coss.com/ui/docs/index.md",
});
assert.strictEqual(entries[3].title, "Alert");

console.log("cossUi tests passed");

