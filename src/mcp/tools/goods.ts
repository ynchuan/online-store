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
      const data = await getPddApi('pdd.ddk.goods.search', { page, page_size })
      return { content: [{ type: "text", text: JSON.stringify(data, null, 1) }], }
    },
  )
  server.tool(
    "pdd.goods.opt.get",
    "查询商品标签列表，详见 https://open.pinduoduo.com/application/document/api?id=pdd.goods.opt.get",
    {
      parent_opt_id: z.number().optional().default(0).describe("值=0时为顶点opt_id,通过树顶级节点获取opt树"),
    },
    async ({ parent_opt_id }) => {
      const data = await getPddApi('pdd.goods.opt.get', { parent_opt_id })
      return { content: [{ type: "text", text: JSON.stringify(data, null, 1) }], }
    },
  )
}