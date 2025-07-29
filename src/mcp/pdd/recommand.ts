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
      page: z.number().optional().default(1).describe('页码，默认1'),
      page_size: z
        .number()
        .optional()
        .default(100)
        .describe('每页数量，默认100'),
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
      goods_id_list: z
        .array(z.string())
        .optional()
        .describe('商品id列表，相似商品推荐场景时必传，仅支持单个goodsId'),
      list_id: z
        .string()
        .optional()
        .describe('翻页时建议填入前页返回的list_id值'),
      sort_type: z
        .number()
        .optional()
        .describe(
          '排序方式:0-综合排序;1-按佣金比率升序;2-按佣金比例降序;3-按价格升序;4-按价格降序;5-按销量升序;6-按销量降序;7-优惠券金额排序升序;8-优惠券金额排序降序;9-券后价升序排序;10-券后价降序排序;11-按照加入多多进宝时间升序;12-按照加入多多进宝时间降序;13-按佣金金额升序排序;14-按佣金金额降序排序;15-店铺描述评分升序;16-店铺描述评分降序;17-店铺物流评分升序;18-店铺物流评分降序;19-店铺服务评分升序;20-店铺服务评分降序;27-描述评分击败同类店铺百分比升序，28-描述评分击败同类店铺百分比降序，29-物流评分击败同类店铺百分比升序，30-物流评分击败同类店铺百分比降序，31-服务评分击败同类店铺百分比升序，32-服务评分击败同类店铺百分比降序',
        ),
      with_coupon: z
        .boolean()
        .optional()
        .describe(
          '是否只返回优惠券的商品，false返回所有商品，true只返回有优惠券的商品',
        ),
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
