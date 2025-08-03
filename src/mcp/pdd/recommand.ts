import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { getPddApi } from '../../lib/utils'

export const register = (server: McpServer) => {
  server.tool(
    'pdd.ddk.goods.recommend.get',
    '多多进宝商品推荐查询，详见 https://open.pinduoduo.com/application/document/api?id=pdd.ddk.goods.recommend.get',
    {
      channel_type: z
        .number()
        .optional()
        .describe(
          '频道类型：0-1.9包邮, 1-今日爆款, 2-品牌清仓, 3-相似商品推荐, 4-猜你喜欢, 5-实时热销, 6-实时收益, 7-今日畅销, 8-高佣榜单，默认5',
        ),
      offset: z
        .number()
        .optional()
        .default(0)
        .describe(
          '从多少位置开始请求；默认值 ： 0，offset需是limit的整数倍，仅支持整页翻页',
        ),
      limit: z
        .number()
        .optional()
        .default(20)
        .describe('一页请求数量；默认值 ： 20'),
      pid: z.string().optional().describe('推广位id'),
      custom_parameters: z
        .string()
        .optional()
        .describe(
          '自定义参数，为链接打上自定义标签；自定义参数最长限制64个字节',
        ),
      goods_sign_list: z
        .array(z.string())
        .optional()
        .describe(
          '商品goodsSign列表，相似商品推荐场景时必传，仅支持单个goodsSign',
        ),
      activity_tags: z
        .array(z.number())
        .optional()
        .describe(
          '活动商品标记数组，例：[4,7]，4-秒杀，7-百亿补贴，10851-千万补贴，11879-千万神券，10913-招商礼金商品，31-品牌黑标，10564-精选爆品-官方直推爆款，10584-精选爆品-团长推荐，24-品牌高佣',
        ),
      cat_id: z.number().optional().describe('商品类目id'),

      list_id: z
        .string()
        .optional()
        .describe('翻页时建议填入前页返回的list_id值'),
      goods_img_type: z
        .number()
        .optional()
        .describe('商品主图类型：1-场景图，2-白底图，默认为0'),
    },
    async (args) => {
      const data = await getPddApi('pdd.ddk.goods.recommend.get', {
        ...args,
        pid: args.pid || '43033220_306360862',
        custom_parameters: args.custom_parameters || 'uid=github_11585769',
      })
      return {
        content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
      }
    },
  )
}
