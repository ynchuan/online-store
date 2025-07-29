import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { getPddApi } from '../../lib/utils'

export const register = (server: McpServer) => {
  server.tool(
    'pdd.ddk.goods.search',
    '多多进宝商品查询，详见 https://open.pinduoduo.com/application/document/api?id=pdd.ddk.goods.search',
    {
      keyword: z.string().optional().describe('商品关键词，可选'),
      opt_id: z.number().optional().describe('商品标签id，可选'),
      cat_id: z.number().optional().describe('商品类目id，可选'),
      merchant_type: z
        .number()
        .optional()
        .describe(
          '店铺类型：1-个人，2-企业，3-旗舰店，4-专卖店，5-专营店，6-普通店',
        ),
      activity_tags: z
        .array(z.number())
        .optional()
        .describe(
          '活动商品标记数组，例：[4,7]，4-秒杀，7-百亿补贴，10851-千万补贴，11879-千万神券，10913-招商礼金商品，31-品牌黑标，10564-精选爆品-官方直推爆款，10584-精选爆品-团长推荐，24-品牌高佣',
        ),
      is_brand_goods: z.boolean().optional().describe('是否为品牌商品'),
      range_list: z
        .object({
          range_from: z.number().optional().describe('商品券后价格区间，从'),
          range_to: z.number().optional().describe('商品券后价格区间，到'),
          range_id: z
            .number()
            .optional()
            .describe(
              '0-最小成团价 1-券后价 2-佣金比例 3-优惠券价格 4-广告创建时间 5-销量 6-佣金金额 7-店铺描述分 8-店铺物流分 9-店铺服务分 10- 店铺描述分击败同行业百分比 11- 店铺物流分击败同行业百分比 12-店铺服务分击败同行业百分比 13-商品分 17 -优惠券/最小团购价 18-过去两小时pv 19-过去两小时销量',
            ),
        })
        .optional()
        .describe(
          '筛选范围列表 样例：[{"range_id":0,"range_from":1,"range_to":1500},{"range_id":1,"range_from":1,"range_to":1500}]',
        ),
      page: z.number().optional().default(1).describe('页码，默认1'),
      page_size: z
        .number()
        .optional()
        .default(100)
        .describe('每页数量，默认100'),
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
      const data = await getPddApi('pdd.ddk.goods.search', {
        ...args,
        pid: '43033220_306360862',
        custom_parameters: { uid: 'github_11585769' },
      })
      return {
        content: [{ type: 'text', text: JSON.stringify(data, null, 1) }],
      }
    },
  )
}
