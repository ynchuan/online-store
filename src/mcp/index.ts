#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { register as registerGoods } from "./tools/goods"
import { register as registerCommon } from "./tools/common"
import { register as registerGood } from "./tools/good"

const server = new McpServer(
  {
    name: "mcp-online-store",
    version: "1.0.0",
  }
)

registerGoods(server)
registerCommon(server)
registerGood(server)

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error("High-level Output Schema Example Server running on stdio")
}

main().catch((error) => {
  console.error("Server error:", error)
  process.exit(1)
})