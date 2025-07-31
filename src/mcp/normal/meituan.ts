import { z } from 'zod'

// 获取美团热门推荐数据
export const getMeituanHotRecommend = async (cityId: string = '1') => {
  try {
    const url = `https://apimobile.meituan.com/group/v1/deal/searchpage/hotword/city/divide/hotrecommend/1?homeBusinessAreaId=673&dynamicTemplate=1&cateId=-1&supportSplitHistory=2&refreshType=discovery%2Crecommend&locCityid=${cityId}&entrance=1&homeCreateTime=${Date.now()}&search_accessibility=0&searchLongTermControl=rest_flow&homePageAddressFromLocate=1&homePagePos=40.0196119%2C116.4679146&utm_medium=android&utm_term=1200390203&version_name=12.39.203&userid=-1&p_appid=10&csecplatform=1&csecversionname=12.39.203&csecpkgname=com.sankuai.meituan&csecversion=1.0.0.55`

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('获取美团热门推荐失败:', error)
    return null
  }
}

// 获取美团美食排行榜数据
export const getMeituanFoodRank = async (
  cityId: string = '1',
  cateId: string = '1',
) => {
  try {
    const url = `https://apimeishi.meituan.com/meishi/search/homepage/foodRank?cityId=${cityId}&userid=-1&requestor=mrn&mypos=40.0196119%2C116.4679156&districtId=&cateId=${cateId}&locCityId=${cityId}&wtt_region_version=&cn_pt=RN&utm_source=meituaninternaltest&utm_medium=android&utm_term=1200390203`

    const response = await fetch(url)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('获取美团美食排行榜失败:', error)
    return null
  }
}

// 注册函数
export const register = async (server: any) => {
  server.tool(
    'get_meituan_hot_recommend',
    '获取美团热门推荐数据',
    {
      cityId: z.string().optional().describe('城市ID，默认为1（北京）'),
    },
    async ({ cityId = '1' }: { cityId?: string }) => {
      try {
        const data = await getMeituanHotRecommend(cityId)
        if (!data) {
          return {
            content: [{ type: 'text', text: '获取美团热门推荐数据失败' }],
          }
        }

        // 格式化返回数据
        let result = `美团热门推荐 (城市ID: ${cityId})\n`
        if (data.data && Array.isArray(data.data)) {
          result += data.data
            .map(
              (item: any, index: number) =>
                `${index + 1}. ${item.title || item.name || '未知'}`,
            )
            .join('\n')
        } else {
          result += JSON.stringify(data, null, 2)
        }

        return {
          content: [{ type: 'text', text: result }],
        }
      } catch (error: any) {
        return {
          content: [
            { type: 'text', text: `获取美团热门推荐失败: ${error.message}` },
          ],
        }
      }
    },
  )

  server.tool(
    'get_meituan_food_rank',
    '获取美团美食排行榜数据',
    {
      cityId: z.string().optional().describe('城市ID，默认为1（北京）'),
      cateId: z.string().optional().describe('分类ID，默认为1（美食）'),
    },
    async ({
      cityId = '1',
      cateId = '1',
    }: {
      cityId?: string
      cateId?: string
    }) => {
      try {
        const data = await getMeituanFoodRank(cityId, cateId)
        if (data && data.data && Array.isArray(data.data.ranks)) {
          const text =
            `美团美食排行榜 (城市ID: ${cityId}, 分类ID: ${cateId})\n` +
            data.data.ranks
              .map((item: any) => {
                return `${item.title} 热搜榜\n${item.items.map((it: any) => `${it.name}`).join('\n')}`
              })
              .join('\n\n')
          return {
            content: [{ type: 'text', text }],
          }
        } else {
          return {
            content: [{ type: 'text', text: '获取美团美食排行榜数据失败' }],
          }
        }
      } catch (error: any) {
        return {
          content: [
            { type: 'text', text: `获取美团美食排行榜失败: ${error.message}` },
          ],
        }
      }
    },
  )
}
