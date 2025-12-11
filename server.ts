import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { request } from "undici";
import { extractPageText } from "./utils/html.js";
import { parseLlmsListing } from "./utils/cossUi.js";

// Create MCP server
const server = new McpServer({
  name: "coss-docs",
  version: "1.0.0",
});

// Parameter schemas (typed to avoid deep instantiation issues)
const pingParams = {
  message: z.string().default("ping"),
} satisfies Record<string, z.ZodTypeAny>;

const fetchCossPageParams = {
  path: z
    .string()
    .min(1)
    .describe("Path under coss.com, e.g. 'pricing' or 'blog' or 'about'"),
} satisfies Record<string, z.ZodTypeAny>;

const fetchCossUiDocParams = {
  docPath: z
    .string()
    .min(1)
    .describe("Path under coss.com/ui/docs, e.g. 'components/button.md' or full URL"),
} satisfies Record<string, z.ZodTypeAny>;

// Simple health-check tool
server.tool(
  "ping",
  pingParams as any,
  async (args: any) => {
    const message = args?.message ?? "ping";
    return {
      content: [
        {
          type: "text" as const,
          text: `pong: ${message}`,
        },
      ],
    } as any;
  }
) as any;

// List Coss UI docs from llms.txt
server.tool(
  "list_coss_ui_docs",
  {},
  async () => {
    const url = "https://coss.com/ui/llms.txt";
    const { statusCode, body } = await request(url, {
      maxRedirections: 3,
      headers: {
        "User-Agent": "coss-mcp/1.0",
        Accept: "text/plain;q=0.9,*/*;q=0.8",
      },
    });

    if (statusCode >= 400) {
      return {
        content: [
          {
            type: "text" as const,
            text: `HTTP ${statusCode} fetching ${url}`,
          },
        ],
      };
    }

    const listingText = await body.text();
    const entries = parseLlmsListing(listingText);
    const lines = entries.map((e) => `- ${e.title}: ${e.href}`);
    const output = lines.length
      ? lines.join("\n")
      : "No entries parsed from llms.txt";

    return {
      content: [
        {
          type: "text" as const,
          text: `Source: ${url}\n${output}`,
        },
      ],
    } as any;
  }
) as any;

// Fetch a specific Coss UI doc (markdown or rendered)
server.tool(
  "fetch_coss_ui_doc",
  fetchCossUiDocParams as any,
  async (args: any) => {
    const rawPath = args?.docPath as string;
    const isFullUrl = /^https?:\/\//i.test(rawPath);
    const clean = rawPath.replace(/^\/+/, "");
    const url = isFullUrl ? rawPath : `https://coss.com/ui/docs/${clean}`;

    const { statusCode, body } = await request(url, {
      maxRedirections: 3,
      headers: {
        "User-Agent": "coss-mcp/1.0",
        Accept: "text/markdown,text/plain;q=0.9,text/html;q=0.8,*/*;q=0.7",
      },
    });

    const textContent = await body.text();

    if (statusCode >= 400) {
      return {
        content: [
          {
            type: "text" as const,
            text: `HTTP ${statusCode} fetching ${url}`,
          },
        ],
      };
    }

    // If it looks like HTML, extract readable text; otherwise return plain text
    const looksHtml = /<\/?[a-z][\s\S]*>/i.test(textContent);
    const payload = looksHtml
      ? extractPageText(textContent).text
      : textContent;

    const truncated = payload.slice(0, 8000);

    return {
      content: [
        {
          type: "text" as const,
          text: `Source: ${url}\n\n${truncated}`,
        },
      ],
    } as any;
  }
) as any;

// Fetch a coss.com page and return rough text
server.tool(
  "fetch_coss_page",
  fetchCossPageParams as any,
  async (args: any) => {
    const path = args?.path;
    const cleanPath = path.replace(/^\/+/, "");
    const url = `https://coss.com/${cleanPath}`;

    const { statusCode, body } = await request(url, {
      maxRedirections: 3,
      headers: {
        "User-Agent": "coss-mcp/1.0",
        Accept: "text/html, text/plain;q=0.9,*/*;q=0.8",
      },
    });

    const html = await body.text();

    if (statusCode >= 400) {
      return {
        content: [
          {
            type: "text" as const,
            text: `HTTP ${statusCode} fetching ${url}`,
          },
        ],
      };
    }

    const { text, title } = extractPageText(html);
    const titleLine = title ? `Title: ${title}\n` : "";

    return {
      content: [
        {
          type: "text" as const,
          text: `Source: ${url}\n${titleLine}\n${text}`,
        },
      ],
    } as any;
  }
);

// Wire up stdio transport (for Cursor)
const transport = new StdioServerTransport();

// Helpful runtime feedback for manual runs (stderr to avoid stdout interference)
console.error("[coss-mcp] Ready on stdio. Waiting for host connection...");
console.error("[coss-mcp] Host config: see README.md -> mcpServers snippet.");
console.error(`[coss-mcp] Working dir: ${process.cwd()}`);
console.error("[coss-mcp] Ctrl+C to exit.");

server.connect(transport);
