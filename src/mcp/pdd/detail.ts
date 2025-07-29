import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { getPddApi } from '../../lib/utils'

export const register = (server: McpServer) => {
  server.tool(
    'pdd.ddk.goods.detail',
    '多多进宝商品详情查询，详见 https://open.pinduoduo.com/application/document/api?id=pdd.ddk.goods.detail',
    {
      goods_id_list: z
        .array(z.string())
        .describe('商品ID列表，支持批量查询，最多支持100个商品ID'),
      pid: z.string().optional().describe('推广位ID，用于生成推广链接'),
      custom_parameters: z
        .string()
        .optional()
        .describe('自定义参数，用于生成推广链接'),
      zs_duo_id: z.number().optional().describe('招商多多客ID'),
      plan_type: z
        .number()
        .optional()
        .describe('佣金优惠券对应推广类型，3：专属 4：招商'),
      search_id: z.string().optional().describe('搜索id，建议填写，提高收益'),
    },
    async (args) => {
      const data = await getPddApi('pdd.ddk.goods.detail', {
        ...args,
        pid: args.pid || '43033220_306360862',
        custom_parameters: args.custom_parameters || 'uid=github_11585769',
      })
      return {
        content: [{ type: 'text', text: JSON.stringify(data, null, 1) }],
      }
    },
  )
}
