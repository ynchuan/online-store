import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { getPddApi } from '../../lib/utils'

export const register = (server: McpServer) => {
  server.tool(
    'pdd.ddk.goods.detail',
    '多多进宝商品详情查询，详见 https://open.pinduoduo.com/application/document/api?id=pdd.ddk.goods.detail',
    {
      goods_sign: z
        .string()
        .describe('商品ID列表，支持批量查询，最多支持100个商品ID'),
      goods_img_type: z
        .number()
        .optional()
        .describe('商品主图类型：1-场景图，2-白底图，默认为0'),
      need_sku_info: z
        .boolean()
        .default(false)
        .optional()
        .describe(
          '是否获取sku信息，默认false不返回。（特殊渠道权限，需额外申请）',
        ),
      pid: z.string().optional().describe('推广位ID，用于生成推广链接'),
      custom_parameters: z
        .string()
        .optional()
        .describe('自定义参数，用于生成推广链接'),
      zs_duo_id: z.number().optional().describe('招商多多客ID'),
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
