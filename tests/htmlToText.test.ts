import assert from "node:assert";
import { extractPageText } from "../utils/html.js";

const sampleHtml = `
<!doctype html>
<html>
  <head>
    <title>Sample Page</title>
    <style>body { color: red; }</style>
    <script>console.log("ignore");</script>
  </head>
  <body>
    <h1>Hello</h1>
    <p>World &amp; more text.</p>
  </body>
</html>
`;

const truncatedHtml = `
<html><body>${"A".repeat(9000)}</body></html>
`;

{
  const { text, title } = extractPageText(sampleHtml, 200);
  assert.strictEqual(title, "Sample Page");
  assert.strictEqual(text, "Hello World & more text.");
}

{
  const { text } = extractPageText(truncatedHtml, 50);
  assert.strictEqual(text.length, 50);
  assert.ok(text.startsWith("A"));
}

console.log("htmlToText tests passed");

