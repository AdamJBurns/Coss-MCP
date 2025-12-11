import { JSDOM } from "jsdom";

/**
 * Extracts readable text and title from HTML, removing script/style content and collapsing whitespace.
 * Limits returned text length to avoid oversized responses.
 */
export function extractPageText(html: string, limit = 8000): { text: string; title?: string } {
  const dom = new JSDOM(html);
  const { document } = dom.window;

  document.querySelectorAll("script, style, noscript").forEach((el: Element) => el.remove());

  const title = document.title?.trim() || undefined;
  const bodyText = document.body?.textContent || "";
  const collapsed = bodyText.replace(/\s+/g, " ").trim();
  const text = collapsed.slice(0, limit);

  return { text, title };
}

