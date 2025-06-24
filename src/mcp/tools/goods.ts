#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"
import login from "../../lib/login"
import { getPddApi } from "../../lib/utils"

export const register = (server: McpServer) => {
  server.tool(
    "pdd.ddk.goods.search",
    "多多进宝商品查询，详见 https://open.pinduoduo.com/application/document/api?id=pdd.ddk.goods.search",
    {
      keyword: z.string().optional().describe("商品关键词，可选"),
      page: z.number().optional().default(1).describe("页码，默认1"),
      page_size: z.number().optional().default(100).describe("每页数量，默认100"),
    },
    async ({ keyword, page = 1, page_size = 100 }) => {
      const token = await login.doLogin()
      if (token) {
        const data = await getPddApi('pdd.ddk.goods.search', { keyword, page, page_size }, token.access_token)
        return { content: [{ type: "text", text: JSON.stringify(data, null, 1) }], }
      } else {
        return { content: [{ type: "text", text: "请先登录" }], }
      }

    },
  )
}