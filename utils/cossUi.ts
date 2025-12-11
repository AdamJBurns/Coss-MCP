type Entry = { title: string; href: string };

const LINK_REGEX = /^\s*-\s*\[([^\]]+)\]\(([^)]+)\)/;

/**
 * Parse the coss ui llms.txt listing into entries.
 * Only keeps markdown-style link bullets.
 */
export function parseLlmsListing(text: string): Entry[] {
  const lines = text.split(/\r?\n/);
  const entries: Entry[] = [];

  for (const line of lines) {
    const match = LINK_REGEX.exec(line);
    if (match) {
      const [, title, href] = match;
      entries.push({ title: title.trim(), href: href.trim() });
    }
  }

  return entries;
}

